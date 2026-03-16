# CI/CD Setup for Auto Deployment

This workflow deploys automatically whenever you push to `main` or `master`.

## 1) Add required GitHub secrets

In your GitHub repository:
Settings -> Secrets and variables -> Actions -> New repository secret

Create these secrets:

- `SSH_HOST`: your server public hostname or IP
- `SSH_PORT`: SSH port (usually `22`)
- `SSH_USER`: deploy user on the server (example: `janmejay`)
- `SSH_PRIVATE_KEY`: private key content used by GitHub Actions
- `SSH_FINGERPRINT`: server host key fingerprint (SHA256)

## 2) Create a deploy SSH key pair

Run on your laptop:

```bash
ssh-keygen -t ed25519 -C "github-actions-deploy" -f ~/.ssh/github_actions_deploy
```

- Put `~/.ssh/github_actions_deploy` into `SSH_PRIVATE_KEY` secret.
- Add `~/.ssh/github_actions_deploy.pub` to server user `~/.ssh/authorized_keys`.

Example to append public key on server:

```bash
cat ~/.ssh/github_actions_deploy.pub | ssh janmejay@YOUR_SERVER "mkdir -p ~/.ssh && chmod 700 ~/.ssh && cat >> ~/.ssh/authorized_keys && chmod 600 ~/.ssh/authorized_keys"
```

## 3) Get SSH host fingerprint

Run:

```bash
ssh-keyscan -p 22 YOUR_SERVER 2>/dev/null | ssh-keygen -lf - -E sha256
```

Copy only the SHA256 fingerprint value into `SSH_FINGERPRINT`.

## 4) Ensure deploy user can run Docker Compose

Preferred option:

```bash
sudo usermod -aG docker janmejay
```

Then log out and log back in once.

Alternative option: allow passwordless sudo for `docker compose`.

## 5) Trigger deployment

- Push to `main` or `master`.
- Or run manually from GitHub Actions using workflow dispatch.

Workflow file:
- `.github/workflows/deploy.yml`

## Deployment behavior

The pipeline does this on each deploy:

1. Builds the React app in CI to catch build errors early.
2. SSHes to server.
3. Pulls latest code in `/home/janmejay/code/janmejay-portfolio`.
4. Rebuilds only portfolio container in `/home/janmejay/docker`:

```bash
docker compose up -d --build janmejay-portfolio
```

## Optional hardening

- Use a dedicated `deploy` Linux user with limited permissions.
- Restrict SSH key in `authorized_keys` with source IP where possible.
- Protect `main` branch with required checks.
