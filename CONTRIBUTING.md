# Contributing to Chanakya

Here, we are going to explain how can you get started quickly with contributing to this repository. We are going to assume that you are completely new to open-source collaboration using GitHub and therefore we will try to explain each of the steps in a simple manner. Let's assume that your GitHub username is `youraccount` and therefore your GitHub profile URL is `https://github.com/youraccount`.

After browsing through the Chanakya project (https://github.com/abraj/chanakya), you somewhat liked it and wish to contribute to it. You have gone through the documentation and source code a bit, and now want to start contributing to the project. However, you are new to GitHub collaboration and not sure about how to get started.

## The GitHub workflow
The following steps are involved in a typical GitHub workflow. This might seem daunting at first, but it feels natural when you get used to it.
1. Fork the target repo to your own GitHub account
2. Clone the forked repo to your local machine
3. Checkout a new '_feature branch_' and make changes
4. Push your feature branch to your GitHub fork repo
5. Create a '_pull request_' on GitHub and discuss with others
6. Make any further changes proposed by others
7. The pull request gets merged to the upstream (target) repo
8. Delete the feature branch

Now, in the following sections, we will understand the above steps in detail.

## Forking the repository for contributing
* Go to the repository at [https://github.com/abraj/chanakya](https://github.com/abraj/chanakya)
* Click on the '_Fork_' button in the top-right corner. This creates a copy of the repository in _your_ GitHub account (having username `youraccount`) at the location `https://github.com/youraccount/chanakya`.
* `git clone https://github.com/youraccount/chanakya`
Execute the above command in the terminal of your local machine. This will clone your fork repository in GitHub account to your local machine.
* `cd chanakya`
Enter the root directory of the repository on your local machine.

_NOTE:_ We will call the original repository as '_Upstream repository_', your forked GitHub repository as '_Fork repository_', and the repository on your local machine as '_Local repository_'.

## Adding the upstream remote
In Git, a [remote](https://stackoverflow.com/a/20889429) repository is any shared repository that is used by users to exchange code changes. It usually sits in the cloud, so in a sense, it is _opposite_ of the 'local' repository. When we cloned the repository from `https://github.com/youraccount/chanakya`, git automatically adds a remote called 'origin' pointing to the `https://github.com/youraccount/chanakya`. repository.
* `git remote -v`
Using the above command, you can list all the remotes for the current repository.
* `git remote add upstream https://github.com/abraj/chanakya.git`
This adds a new remote called 'upstream' pointing to the upstream repository `https://github.com/abraj/chanakya.git`.
* `git fetch upstream`
Having addded the upstream remote, now we download latest data from the upstream remote repository. Note that running this command also creates a 'remote-tracking' branch on your local repository which is named like `upstream/master`. To view all (local and remote) branches in your repository, run: `git branch -avv`
* `git merge upstream/master`
The above command merges (integrates) the recently fetched data with your local working copy of the code.

## Creating a feature branch for your changes
Now, you are ready to start performing you own changes to the local source code. However, there is only one rule: never directly work on your changes on 'master' branch. This ensures that master branch is never corrupt and is always deployable. So, if you want to make changes related to your new awesome feature, just create a new branch and call it comething like `awesome-feature`.
* `git branch awesome-feature`
* `git checkout awesome-feature`
After executing the above two commands, you are now in the newly created branch `awesome-feature`. To verify that your current working branch has changed, run: `git branch -vv`. The `*` in front of a branch name indicates that it is the currently active branch.

Now, you are ready to make your own changes corresponding to your awesome feature. After making the required changes to the feature branch, you can [commit](https://www.atlassian.com/git/tutorials/saving-changes) all your changes to this branch.

## Creating pull request and having discussion
Once you are ready to with your suggested changes for the awesome feature, you want to get others' feedback and suggestions before it can get accepted and merged in the upstream repository.

For doing that, first you push your changes to your fork repository on GitHub using the following command.

* `git push -u origin awesome-feature`
This command pushes your changes to your GitHub fork by Creating a new branch `awesome-feature` there. The `-u` flag ensures that from next time onwards, when we are in the local `awesome-feature` branch, simply doing a `git push` will push the local changes to the `awesome-feature` branch on GitHub fork.

Now, go to your GitHub repository. You will see and option to create a '_pull request_' from the `awesome-feature` branch there. A pull request lets you tell others about changes you've pushed to a GitHub repository. In our case here, the pull request will look for changes in the `youraccount:awesome-feature` branch in your fork repository with respect to the `abraj:master` branch on the upstream GitHub repository.

A pull request on GitHub is also a great place for having discussion and get feedback from others. You may need to further modify your code for the feature based on others' feedback.

For doing that just checkout `awesome-feature` repository in your local repository:
* `git checkout awesome-feature`

Now, make more changes to the feature branch locally and commit the changes to `awesome-feature` branch. Now, to push the changes to the `awesome-feature` branch on your GitHub fork, simply run the command:
* `git push`

When you push the changes to the `awesome-feature` branch on your GitHub fork, it also automatically updates the pull request corresponding to the `awesome-feature` branch and others can immediately view the your latest changes.

The process continuously iterates in this fashion and when your changes look good to the maintainers of the upstream repository, they can merge your changes to upstream repository (https://github.com/abraj/chanakya).

That's it. Awesome!
Now, you are a contributor to the Chanakya project.

## Sync latest changes from upstream repository
While you are working on your awesome feature changes, the upstream repository (https://github.com/abraj/chanakya) might have got new changes from others basically making your GitHub fork and local copy outdated. So, now we need to pull the latest changes from upstream repository.

* `git checkout master`
This changes your current working copy to the master branch.

* `git fetch upstream`
Now, fetch the latest changes from upstream remote (which we previously configured as https://github.com/abraj/chanakya).

* `git merge upstream/master`
Merge the fetched changes to the local copy of the master branch.

* `git push`
Also, push the changes to the master branch at your GitHub fork repository.

If you have **not yet created** a pull request, you might want to integrate the changes in your `awesome-feature` branch also by running the following commands.

* `git checkout awesome-feature`
* `git rebase master`
* `git push`

_WARNING:_ Plaese don't integrate the fetched changes to `awesome-feature` branch if you have **already created** a pull request corresponding to this branch.

## Delete the feature branch
The only purpose of a feature branch is to work separately on a feature, eventually leading to its merge to the master branch of the upstream repository. Once this is completed, you can safely delete the `feature-branch` on your local repository as well as the GitHub fork repository.

* Delete _`awesome-feature`_ branch on your GitHub fork

Now, you can delete the local and remote-tracking branches in your local repository using the following commands:
* `git checkout master`
* `git branch -d -r origin/awesome-feature`
* `git branch -D awesome-feature`

To get the latest copy of upstream repository with _your_ changes also integrated into it, follow the steps already mentioned in the previous section.

_NOTE:_ It is recommended never to merge any of your changes directly into your local `master` branch. Rather, sync your `master` branch only by pulling in the latest changes from the _upstream_ repository.

## Useful Tip
In particular, the following git command is very useful for viewing all your commits as a tree structure in your terminal itself.

* `git log --graph --oneline --decorate --all`

This command is so often used that you might want to add an alias for this command on your system.
For example, on unix-based systems, you can add the following line to your `.bashrc` file.

```
alias gg='git log --graph --oneline --decorate --all'
```

## Further Reading
* [Understanding the GitHub flow](https://guides.github.com/introduction/flow/)
* [GitHub flow](https://help.github.com/en/articles/github-flow)
* [How to Collaborate On GitHub](https://code.tutsplus.com/tutorials/how-to-collaborate-on-github--net-34267)
* [Collaborating with issues and pull requests](https://help.github.com/en/categories/collaborating-with-issues-and-pull-requests)
* [How GitHub Uses GitHub to Build GitHub](https://zachholman.com/talk/how-github-uses-github-to-build-github/)
