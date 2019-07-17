workflow "Build and Test" {
  resolves = ["Frontend: Build"]
  on = "push"
}

action "Frontend: Install Libs" {
  uses = "actions/npm@master"
  args = "install -g --prefix ./frontend ./frontend"
}

action "Frontend: Build" {
  uses = "actions/npm@master"
  needs = ["Frontend: Install Libs"]
  args = "run build --prefix ./frontend"
}
