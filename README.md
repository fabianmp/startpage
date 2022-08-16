# startpage

Simple browser start page built using [Vue.js](https://vuejs.org) and [tailwindcss](https://tailwindcss.com).
Static data can be loaded from [startpage-data.js](startpage-data.js).
If static data is empty all data is loaded from and stored in [browser local storage](https://developer.mozilla.org/en-US/docs/Web/API/Window/localStorage).

> Access this page (data is stored only in your browser) at
>
> https://fabianmp.github.io/startpage

## Used libraries

- [Vue.js](https://vuejs.org)
- [tailwindcss](https://tailwindcss.com)
- [tippy.js](https://atomiks.github.io/tippyjs)
- [popper.js](https://popper.js.org)
- [Font Awesome](https://fontawesome.com)

# Helm Chart

![Version: 0.1.0](https://img.shields.io/badge/Version-0.1.0-informational?style=flat-square) ![Type: application](https://img.shields.io/badge/Type-application-informational?style=flat-square)

A Helm chart for a simple portal page

**Homepage:** <https://github.com/fabianmp/startpage>

## Maintainers

| Name | Email | Url |
| ---- | ------ | --- |
| Fabian Zach | <fabian.zach@methodpark.de> | <https://github.com/fabianmp> |

## Source Code

* <https://github.com/fabianmp/startpage>

## Values

| Key | Type | Default | Description |
|-----|------|---------|-------------|
| affinity | object | `{}` | Affinity for pods (see [Kubernetes docs](https://kubernetes.io/docs/concepts/scheduling-eviction/assign-pod-node/#affinity-and-anti-affinity)) |
| authorization.clientId | string | `nil` | OIDC client id |
| authorization.clientSecret | string | `nil` | OIDC client secret |
| authorization.cookieSecret | string | `nil` | Secret used to encrypt cookies |
| authorization.enabled | bool | `false` | Require authorization to access the portal page |
| authorization.externalAddress | string | `"http://chart-example.local"` | External address of the protected service (used as redirect URI) |
| authorization.issuerUrl | string | `nil` | URL of the OIDC issuer |
| authorization.provider | string | `"keycloak-oidc"` | OIDC provider (see [documentation](https://oauth2-proxy.github.io/oauth2-proxy/docs/configuration/oauth_provider)) |
| fullnameOverride | string | `""` | Override full name of this release |
| groups | list | List of groups (see [values.yaml](values.yaml)) | Groups to display on the portal page |
| image.nginx.repository | string | `"nginx"` | Image to use without authorization |
| image.nginx.tag | string | `"1.23-alpine"` | Tag to use without authorization |
| image.oauth.repository | string | `"quay.io/oauth2-proxy/oauth2-proxy"` | Image to use if authorization is required |
| image.oauth.tag | string | `"v7.3.0"` | Tag to use if authorization is required |
| image.pullPolicy | string | `"IfNotPresent"` | Image pull policy |
| imagePullSecrets | list | `[]` | Image pull secrets for the pod |
| ingress.annotations | object | `{}` | Annotations to be added to ingress |
| ingress.className | string | `""` | Ingress class name |
| ingress.enabled | bool | `false` | Enable ingress |
| ingress.hosts | list | List of hosts and paths for the ingress (see [values.yaml](values.yaml)) | Ingress host configuration |
| ingress.tls | list | `[]` | TLS configuration for the ingress @default List of hosts and secrets (see [values.yaml](values.yaml)) |
| nameOverride | string | `""` | Override name of this release |
| nodeSelector | object | `{}` | Node selector for pods (see [Kubernetes docs](https://kubernetes.io/docs/concepts/scheduling-eviction/assign-pod-node/#nodeselector)) |
| podAnnotations | object | `{}` | Annotations to be added to the pod |
| replicaCount | int | `1` | Number of replicas |
| resources | object | `{}` | Container resources (see [Kubernetes docs](https://kubernetes.io/docs/concepts/configuration/manage-resources-containers/#requests-and-limits)) |
| service.port | int | `80` | Service port |
| service.type | string | `"ClusterIP"` | Service type |
| tolerations | list | `[]` | Tolerations for pods (see [Kubernetes docs](https://kubernetes.io/docs/concepts/scheduling-eviction/taint-and-toleration/)) |
