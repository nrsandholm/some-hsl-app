import { DnsValidatedCertificate } from '@aws-cdk/aws-certificatemanager';
import { CloudFrontWebDistribution, OriginProtocolPolicy, SSLMethod, SecurityPolicyProtocol } from '@aws-cdk/aws-cloudfront';
import { ARecord, RecordTarget, HostedZone } from '@aws-cdk/aws-route53';
import { CloudFrontTarget } from '@aws-cdk/aws-route53-targets/lib';
import { Bucket } from '@aws-cdk/aws-s3';
import { BucketDeployment, Source } from '@aws-cdk/aws-s3-deployment';
import * as cdk from '@aws-cdk/core';

export interface SiteProps {
  domainName: string;
  subDomainName?: string;
}

export class InfraStack extends cdk.Stack {
  constructor(scope: cdk.Construct, id: string, props: SiteProps, stackProps: cdk.StackProps) {
    super(scope, id, stackProps);

    const zone = HostedZone.fromLookup(this, 'Zone', { domainName: props.domainName });
    const siteDomain = [props.subDomainName, props.domainName].filter(Boolean).join('.');
    new cdk.CfnOutput(this, 'Site', { value: 'https://' + siteDomain });

    const websiteBucket = new Bucket(this, 'WebsiteBucket', {
      websiteIndexDocument: 'index.html',
      publicReadAccess: true
    });

    const certificateArn = new DnsValidatedCertificate(this, 'SiteCertificate', {
      domainName: siteDomain,
      hostedZone: zone,
      region: 'eu-central-1',
    }).certificateArn;

    const distribution = new CloudFrontWebDistribution(this, 'SiteDistribution', {
      aliasConfiguration: {
        acmCertRef: certificateArn,
        names: [ siteDomain ],
        sslMethod: SSLMethod.SNI,
        securityPolicy: SecurityPolicyProtocol.TLS_V1_1_2016,
      },
      originConfigs: [{
        customOriginSource: {
            domainName: websiteBucket.bucketWebsiteDomainName,
            originProtocolPolicy: OriginProtocolPolicy.HTTP_ONLY,
        },
        behaviors : [ {isDefaultBehavior: true}],
      }]
    });

    new ARecord(this, 'SiteAliasRecord', {
      recordName: siteDomain,
      target: RecordTarget.fromAlias(new CloudFrontTarget(distribution)),
      zone
    });
    
    new BucketDeployment(this, 'DeployWebsite', {
      sources: [Source.asset('../app/dist')],
      destinationBucket: websiteBucket,
    });
  }
}
