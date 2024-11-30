#!/bin/bash

# Input arguments
appName=$1
primaryRegion=$2
secondaryRegion=$3

appNameLower=$(echo "$appName" | awk '{print tolower($0)}')
bucketNameParam="/apps/admin-ui/secondary-bucket-name"

# Fetch the existing bucket name from the primary region
existingBucketName=$(aws ssm get-parameter --name "${bucketNameParam}" --region "${primaryRegion}" --query "Parameter.Value" --output text 2>/dev/null || echo "")

prefix="secondary-bucket-"

# Function to create a new bucket and store its name
create_and_store_bucket() {
  newBucketName="${prefix}${appNameLower}-$(date +%s)"
  if aws s3 mb "s3://${newBucketName}" --region "${secondaryRegion}"; then
    # Store the new bucket name in SSM Parameter Store in both regions
    aws ssm put-parameter --name "${bucketNameParam}" --value "${newBucketName}" --type String --overwrite --region "${primaryRegion}"
    aws ssm put-parameter --name "${bucketNameParam}" --value "${newBucketName}" --type String --overwrite --region "${secondaryRegion}"
    echo "Bucket created in ${secondaryRegion} and name stored in SSM Parameter Store."
    check_and_configure_cloudfront "${newBucketName}"
  else
    echo "Failed to create bucket in ${secondaryRegion}."
    exit 1
  fi
}

# Check for existing CloudFront distribution and update bucket policy
check_and_configure_cloudfront() {
  bucketName=$1
  description="$appName distribution"
  # Fetch CloudFront distribution details by description filter
  distributionId=$(aws cloudfront list-distributions --query "DistributionList.Items[?Comment=='${description}'].Id" --output text --region "${primaryRegion}")

  if [[ "$distributionId" != "None" ]]; then
    echo "CloudFront distribution found: $distributionId"
    # Get the OAI
    originAccessIdentity=$(aws cloudfront get-distribution --id "${distributionId}" --query "Distribution.DistributionConfig.Origins.Items[?DomainName=='${bucketName}.s3.${secondaryRegion}.amazonaws.com'].S3OriginConfig.OriginAccessIdentity" --output text --region "${primaryRegion}")
    # Remove prefix (origin-access-identity/cloudfront/)
    oaiId="${originAccessIdentity#origin-access-identity/cloudfront/}"

    echo "Configuring bucket policy for OAI: $oaiId"
    # Construct and apply bucket policy
    policy=$(cat <<EOF
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Effect": "Allow",
      "Principal": {"AWS": "arn:aws:iam::cloudfront:user/CloudFront Origin Access Identity ${oaiId}"},
      "Action": "s3:GetObject",
      "Resource": "arn:aws:s3:::${bucketName}/*"
    }
  ]
}
EOF
    )
    aws s3api put-bucket-policy --bucket "${bucketName}" --policy "${policy}" --region "${secondaryRegion}"
    echo "Bucket policy updated for ${bucketName}"
  else
    echo "No CloudFront distribution with description '${description}' found. Skipping policy update."
  fi
}

if [[ "$existingBucketName" == "$prefix"* ]]; then
  echo "Existing bucket found in ${primaryRegion} with the correct prefix: ${existingBucketName}. Checking and configuring CloudFront."
  check_and_configure_cloudfront "${existingBucketName}"
elif [ -z "${existingBucketName}" ]; then
  echo "No existing bucket found in ${primaryRegion}. Creating a new bucket in ${secondaryRegion}..."
  create_and_store_bucket
else
  echo "Existing bucket found in ${primaryRegion} but does not start with 'secondary-bucket-': ${existingBucketName}. Creating a new bucket..."
  create_and_store_bucket
fi
