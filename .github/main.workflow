workflow "Build and Test" {
  resolves = ["Frontend: Build"]
  on = "push"
}

action "Frontend: Install Libs" {
  uses = "actions/npm@master"
  runs = "bash -c \"cd ./frontend && npm install\""
}

action "Frontend: Build" {
  uses = "actions/npm@master"
  needs = ["Frontend: Install Libs"]
  runs = "bash -c \"cd ./frontend && npm run build\""
}
