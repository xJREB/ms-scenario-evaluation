workflow "Build and Test" {
  resolves = [
    "Frontend: Build",
    "API: Build",
  ]
  on = "push"
}

action "Frontend: Install Libs" {
  uses = "actions/npm@master"
  args = "install --prefix ./frontend ./frontend"
}

action "Frontend: Build" {
  uses = "actions/npm@master"
  needs = ["Frontend: Install Libs"]
  args = "run build --prefix ./frontend"
}

action "API: Install Libs" {
  uses = "actions/npm@master"
  args = "install --prefix ./api. /api"
}

action "API: Build" {
  uses = "actions/npm@master"
  needs = ["API: Install Libs"]
  args = "run build --prefix ./api"
}
