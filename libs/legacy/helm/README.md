# Superagent Helm Charts

## Introduction

This chart bootstraps a [superagent](https://github.com/homanp/superagent) deployment on a [Kubernetes](http://kubernetes.io) cluster using the [Helm](https://helm.sh) package manager.

## Setup

 Carefully review the values and prepare your own values, this chart is not expected to run without first configuring the values to your needs.

### Pre-requisites

Clone the latest version of superagent

``` bash
LATEST_TAG=$(curl --silent "https://api.github.com/repos/homanp/superagent/releases/latest" | jq -r .tag_name)
echo cloning superagent release $LATEST_TAG
git clone --branch $LATEST_TAG https://github.com/homanp/superagent.git
```

 Provide the UI `NEXT_PUBLIC_` env vars - see [Dealing with NextJS NEXT_PUBLIC_ env vars](#dealing-with-nextjs-next_public_-env-vars)

``` bash
cp .env.production superagent/ui/.env.production
```

Build the docker images and push to a docker registry, set the repository, image and tag in your `myValues.yml`. See []()

### Sub chart dependencies

In order to run the chart, you must add the repositories included as sub charts.

```console
helm repo add bitnami https://charts.bitnami.com/bitnami
helm repo add runix https://helm.runix.net
helm repo update
helm dependency update
helm dependency build
```

## Install or Upgrade the Chart

First, create the `superagent` namespace, this command can be run multiple times without erroring if the namespace exists, useful for CI

``` bash
kubectl create namespace superagent --dry-run=client -o yaml | kubectl apply -f -
``````

To install or upgrade the chart with the release name `superagent` in the namespace `superagent`, using a custom myValues.yml file, this can be used to both install and update the release.

``` bash
# Helm 3
helm upgrade --install superagent ./helm -f myValues.yml -n superagent
```

## Uninstall the Chart

To uninstall/delete the `superagent` deployment:

``` bash
helm uninstall superagent -n superagent
helm delete --purge superagent

# Check for any pvc/pv and delete them manually if needed
kubectl get pvc --all-namespaces | grep superagent
kubectl delete pvc <PVC_NAME> -n superagent
kubectl get pv | grep superagent
kubectl delete pv <PV_NAME>
```

The commands remove all the Kubernetes components associated with the chart and deletes the release.

Check for any left overs with:

``` bash
kubectl get all,configmap,secret,pvc,pv,ingress,role,rolebinding,clusterrole,clusterrolebinding --all-namespaces -l release=superagent
```

## Configuration

Here are the top level values for reference.

> **Tip**: For more detailed information, you can view the default [values.yaml](https://github.com/homanp/superagent/blob/master/helm/values.yaml) and look at the [examples](https://github.com/homanp/superagent/blob/master/helm/examples) for examples on how to configure the values to suit your deployment.

| Parameter | Description | Default |
| --------- | ----------- | ------- |
| `image.api.repository` | API image repository | `<-- YOUR API IMAGE REPOSITORY -->` |
| `image.api.tag` | API image tag | `<-- YOUR API IMAGE TAG -->` |
| `image.api.pullPolicy` | API image pull policy | `IfNotPresent` |
| `image.ui.repository` | UI image repository | `<-- YOUR UI IMAGE REPOSITORY -->` |
| `image.ui.tag` | UI image tag | `<-- YOUR UI IMAGE TAG -->` |
| `image.ui.pullPolicy` | UI image pull policy | `IfNotPresent` |
| `api.enabled` | Enable API component | `true` |
| `api.replicas` | Number of API replicas | `1` |
| `api.resources` | API resource limits and requests | `{}` |
| `ui.enabled` | Enable UI component | `true` |
| `ui.replicas` | Number of UI replicas | `1` |
| `ui.resources` | UI resource limits and requests | `{}` |
| `ingress.enabled` | Enable ingress | `false` |
| `ingress.className` | Ingress class name | `''` |
| `ingress.annotations` | Ingress annotations | `{}` |
| `ingress.hosts` | Ingress hosts | `superagent-ui.local`, `superagent-api.local` |
| `ingress.tls` | Ingress TLS settings | `[]` |
| `postgresql.enabled` | Enable PostgreSQL subchart | `false` |
| `postgresql.global.postgresql.auth.username` | PostgreSQL username | `admin` |
| `postgresql.global.postgresql.auth.password` | PostgreSQL password | `password` |
| `postgresql.global.postgresql.auth.database` | PostgreSQL database | `superagent` |
| `pgadmin4.enabled` | Enable pgAdmin4 subchart | `false` |
| `pgadmin4.env.email` | pgAdmin4 email | `dev@superagent.sh` |
| `pgadmin4.env.password` | pgAdmin4 password | `password` |

Provide a YAML file that specifies the values for the parameters while installing the chart. For example:

  ``` bash
  # Helm 3
  helm upgrade --install superagent ./helm -f myValues.yml -n superagent
  ```

## Dealing with NextJS NEXT_PUBLIC_ env vars

As superagent UI is build using NextJS, some of the environment variables passed into the Docker container running in Kubernetes will be ignored unless they are provided at the time the image is built. There are a couple of ways to deal with this.

1. Copy your own `.env.production` in the `ui` folder, with the values for any `NEXT_PUBLIC_` env vars that you are using (don't include any values for non NEXT_PUBLIC_ env vars) and only include the ones you are actually using.

``` bash
cp .env.production superagent/ui/.env.production
```

2. Alternatively you can check in the following file in the `ui` folder, this contains placeholders for the `NEXT_PUBLIC_` vars which will be automatically replaced with the `ui.env:` values provided in the your helm `myValues.yml` file. This means you can just configure all of the env vars in your `myValues.yml` via your CI and enables multi environment deployments.

Take the example below, and uncomment the exect values you need, delete the rest

``` yaml
NEXT_PUBLIC_SUPERAGENT_API_URL=APP_NEXT_PUBLIC_SUPERAGENT_API_URL
NEXT_PUBLIC_AWS_S3_BUCKET=APP_NEXT_PUBLIC_AWS_S3_BUCKET
NEXT_PUBLIC_AWS_S3_REGION=APP_NEXT_PUBLIC_AWS_S3_REGION
NEXT_PUBLIC_AMAZON_S3_ACCESS_KEY_ID=APP_NEXT_PUBLIC_AMAZON_S3_ACCESS_KEY_ID
NEXT_PUBLIC_AMAZON_S3_SECRET_ACCESS_KEY=APP_NEXT_PUBLIC_AMAZON_S3_SECRET_ACCESS_KEY
# NEXT_PUBLIC_AWS_OVERRIDE_S3_BASEURL=APP_NEXT_PUBLIC_AWS_OVERRIDE_S3_BASEURL
NEXT_PUBLIC_SHARABLE_KEY_SECRET=APP_NEXT_PUBLIC_SHARABLE_KEY_SECRET
# NEXT_PUBLIC_GITHUB_CLIENT_ID=APP_NEXT_PUBLIC_GITHUB_CLIENT_ID
# NEXT_PUBLIC_GITHUB_CLIENT_SECRET=APP_NEXT_PUBLIC_GITHUB_CLIENT_SECRET
# NEXT_PUBLIC_GOOGLE_CLIENT_ID=APP_NEXT_PUBLIC_GOOGLE_CLIENT_ID
# NEXT_PUBLIC_GOOGLE_CLIENT_SECRET=APP_NEXT_PUBLIC_GOOGLE_CLIENT_SECRET
# NEXT_PUBLIC_AZURE_AD_CLIENT_ID=APP_NEXT_PUBLIC_AZURE_AD_CLIENT_ID
# NEXT_PUBLIC_AZURE_AD_CLIENT_SECRET=APP_NEXT_PUBLIC_AZURE_AD_CLIENT_SECRET
# NEXT_PUBLIC_AZURE_AD_TENANT_ID=APP_NEXT_PUBLIC_AZURE_AD_TENANT_ID
# NEXT_PUBLIC_STRIPE_SECRET_KEY=APP_NEXT_PUBLIC_STRIPE_SECRET_KEY
# NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=APP_NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY
# NEXT_PUBLIC_SEGMENT_WRITE_KEY=APP_NEXT_PUBLIC_SEGMENT_WRITE_KEY
# NEXT_PUBLIC_STRIPE_FREE_PLAN_ID=APP_NEXT_PUBLIC_STRIPE_FREE_PLAN_ID
# NEXT_PUBLIC_PSYCHIC_PUBLIC_KEY=APP_NEXT_PUBLIC_PSYCHIC_PUBLIC_KEY
```

Then copy this into the `superagent/ui` folder before you build the docker images.

``` bash
cp .env.production superagent/ui/.env.production
```

## Preparing Docker Images

Before deploying the Helm chart, you need to build and push Docker images for both the API and UI components. Below are the steps to do so:

### Build and Push API Docker Image

This short guide outlines the steps needed to build and push the images and configure the helm chart values wih the image details, your usage will vary depending on your setup, here are the basics.

1. Navigate to the root directory of the project where the `Dockerfile` for the API is located.

    ``` bash
    cd superagent
    ```

2. Build the Docker image:

    ``` bash
    docker build -t superagent-api:<your-tag> .
    ```

3. Push the image to your Docker repository:

    ``` bash
    docker push superagent-api:<your-tag> 
    ```

### Build and Push UI Docker Image

1. Navigate to the `ui` directory where the `Dockerfile` for the UI is located.

    ``` bash
    cd superagent/ui
    ```

2. Build the Docker image:

    ``` bash
    docker build -t superagent-ui:<your-tag> .
    ```

3. Push the image to your Docker repository:

    ```console
    docker push superagent-ui:<your-tag>
    ```

### Update Helm Chart Values

After successfully pushing the images, update the `myValues.yml` file with the image details:

```yaml
image:
  api:
    repository: your-api-image-repository
    tag: your-api-image-tag
  ui:
    repository: your-ui-image-repository
    tag: your-ui-image-tag
```
