const { Octokit } = require("@octokit/action");
const github = require("@actions/github");
const core = require("@actions/core");
const axios = require("axios");

async function run() {
    const octokit = new Octokit({
        previews: ["ant-man-preview"],
    });
    const webhookUrl = core.getInput("url");

    const pr = github.context.payload.pull_request;

    if (webhookUrl.includes("delete")) {
        await octokit.repos.listDeployments({
            owner: github.context.repo.owner,
            repo: github.context.repo.repo,
            environment: `qa-${pr.number}`,
        })
        .then(async ({data}) => {
            data.map(async (deployment) => {
                await octokit.repos.createDeploymentStatus({
                    owner: github.context.repo.owner,
                    repo: github.context.repo.repo,
                    deployment_id: deployment.id,
                    state: "inactive",
                })
                .then(async () => {
                    await octokit.repos.deleteDeployment({
                        owner: github.context.repo.owner,
                        repo: github.context.repo.repo,
                        deployment_id: deployment.id,
                    });
                });
            });
        });

        return axios.post(webhookUrl, {
            "pr": pr.number,
        });
    }

    const deployment = await octokit.repos.createDeployment({
        owner: github.context.repo.owner,
        repo: github.context.repo.repo,
        ref: pr.head.ref,
        required_contexts: [],
        environment: `qa-${pr.number}`,
        transient_environment: true,
        auto_merge: false,
    });

    const postData = {
        "pr": pr.number,
        "branch": pr.head.ref,
    }

    axios.post(webhookUrl, postData)
    .then(async ({data}) => {
        switch(data.status) {
            case "success":
                await octokit.repos.createDeploymentStatus({
                    owner: github.context.repo.owner,
                    repo: github.context.repo.repo,
                    deployment_id: deployment.data.id,
                    state: "success",
                    environment_url: data.url,
                });
                break;

            case "failure":
                await octokit.repos.createDeploymentStatus({
                    owner: github.context.repo.owner,
                    repo: github.context.repo.repo,
                    deployment_id: deployment.data.id,
                    state: "failure",
                });
                break;
        }
    })
    .catch(async () => {
        await octokit.repos.createDeploymentStatus({
            owner: github.context.repo.owner,
            repo: github.context.repo.repo,
            deployment_id: deployment.data.id,
            state: "failure",
        });
    });
}

run();
