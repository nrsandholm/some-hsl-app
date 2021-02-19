import * as cdk from '@aws-cdk/core';
import { Bucket } from '@aws-cdk/aws-s3';
import { BucketDeployment, Source } from '@aws-cdk/aws-s3-deployment';

export class InfraStack extends cdk.Stack {
  constructor(scope: cdk.Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    const websiteBucket = new Bucket(this, 'WebsiteBucket', {
      websiteIndexDocument: 'index.html',
      publicReadAccess: true
    });
    
    new BucketDeployment(this, 'DeployWebsite', {
      sources: [Source.asset('../app/dist')],
      destinationBucket: websiteBucket,
    });
  }
}
