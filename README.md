# Some HSL app

Some HSL app is a simple web application that utilizes HSL's GraphQL API to fetch most nearest stops and routes based on user's current location.

## Dependencies

- yarn
- npx
- cdk
- aws-cli

## Run

```
yarn install
yarn start
```

## Deployment

### Configure (only once)

```
aws configure
cd infra
cdk bootstrap aws://ACCOUNT_ID/REGION
```

### Build

```
cd app
yarn install
yarn build
```

### Deploy

```
cd infra
yarn install
cdk synth # Just verification
cdk deploy
```

## License
[MIT](https://choosealicense.com/licenses/mit/)