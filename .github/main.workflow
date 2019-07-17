workflow "Build and Test" {
  resolves = [
    "API: SonarQube",
    "Frontend: SonarQube",
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
  args = "install --prefix ./api ./api"
}

action "API: Build" {
  uses = "actions/npm@master"
  needs = ["API: Install Libs"]
  args = "run build --prefix ./api"
}

action "API: SonarQube" {
  uses = "actions/npm@master"
  needs = ["API: Build"]
  args = "run sonar --prefix ./api -- -Dsonar.login=$SONAR_LOGIN"
  secrets = ["GITHUB_TOKEN", "SONAR_LOGIN"]
}

action "Frontend: SonarQube" {
  uses = "actions/npm@master"
  needs = ["Frontend: Build"]
  secrets = ["GITHUB_TOKEN", "SONAR_LOGIN"]
  args = "run sonar --prefix ./frontend -- -Dsonar.login=$SONAR_LOGIN"
}
