workflow "Build and Test" {
  resolves = ["Frontend: Build"]
  on = "push"
}

action "Frontend: Install Libs" {
  uses = "actions/npm@master"
  runs = "cd ./frontend && npm install"
}

action "Frontend: Build" {
  uses = "actions/npm@master"
  needs = ["Frontend: Install Libs"]
  runs = "cd ./frontend && npm run build"
}
