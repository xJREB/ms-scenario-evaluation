########################################################################
# Survey Results Evaluation
########################################################################

# Delete current environment variables --------
rm(list = ls(all.names = TRUE))

# Load required packages -------
library(dplyr)
library(ggplot2)
library(corrplot)
library(likert)

# Read data ------------
data <- read.csv("survey-data.csv")
str(data)
summary(data)

# Participant demographics --------

# Years of professional experience
hist(data$demographics_years.of.experience)

# Self-reported experience with scenario-based methods (1-5)
hist(data$demographics_familiarity.scenarios)
data %>% count(demographics_familiarity.scenarios)

# Self-reported experience with service- and microservice-based systems (1-5)
hist(data$demographics_familiarity.services)
data %>% count(demographics_familiarity.services)

# Active in industry, academia, or both
data %>% count(demographics_active.field)

demographics <- 
  data %>%
  # optionally group by active field (industry, academia, both)
  # group_by(demographics_active.field) %>% 
  summarise(
    numParticipants = n(),
    # Years of professional experience
    medianYearsOfExperience = median(demographics_years.of.experience),
    q1YearsOfExperience = quantile(demographics_years.of.experience)[2],
    q3YearsOfExperience = quantile(demographics_years.of.experience)[4],
    meanYearsOfExperience = mean(demographics_years.of.experience),
    sdYearsOfExperience = sd(demographics_years.of.experience),
    # Percentage that used a scenario-based method for a real world project before
    percentageScenarioUsage = mean(demographics_used.scenarios.before),
    # Self-reported experience with scenario-based methods (1-5)
    medianScenariosExperience = median(demographics_familiarity.scenarios),
    q1ScenariosExperience = quantile(demographics_familiarity.scenarios)[2],
    q3ScenariosExperience = quantile(demographics_familiarity.scenarios)[4],
    meanScenariosExperience = mean(demographics_familiarity.scenarios),
    sdScenariosExperience = sd(demographics_familiarity.scenarios),
    # Self-reported experience with service- and microservice-based systems (1-5)
    medianServicesExperience = median(demographics_familiarity.services),
    q1ServicesExperience = quantile(demographics_familiarity.services)[2],
    q3ServicesExperience = quantile(demographics_familiarity.services)[4],
    meanServicesExperience = mean(demographics_familiarity.services),
    sdServicesExperience = sd(demographics_familiarity.services)
  )


# Effort estimation techniques --------

likertLevels <- c("1", "2", "3", "4", "5")
likertLabels <- c("strongly disagree (1)", "disagree (2)", "somewhat agree (3)", "agree (4)", "strongly agree (5)")

# Participants' familiarity with the different techniques
data %>%
  # optionally filter for most experienced participants
  # filter(demographics_familiarity.scenarios > 2) %>%
  # filter(demographics_familiarity.services > 2) %>%
  # filter(demographics_used.scenarios.before == 1) %>%
  # filter(demographics_years.of.experience > 4) %>%
  select(contains(".familiarity")) %>%
  mutate(effort_hours.familiarity = factor(effort_hours.familiarity, levels = likertLevels, ordered = TRUE, labels = likertLabels)) %>%
  mutate(effort_loc.familiarity = factor(effort_loc.familiarity, levels = likertLevels, ordered = TRUE, labels = likertLabels)) %>%
  mutate(effort_ordinal.scale.familiarity = factor(effort_ordinal.scale.familiarity, levels = likertLevels, ordered = TRUE, labels = likertLabels)) %>%
  mutate(effort_cosmic.fp.familiarity = factor(effort_cosmic.fp.familiarity, levels = likertLevels, ordered = TRUE, labels = likertLabels)) %>%
  mutate(effort_story.points.familiarity = factor(effort_story.points.familiarity, levels = likertLevels, ordered = TRUE, labels = likertLabels)) %>%
  rename("I am familiar with hours estimation" = effort_hours.familiarity) %>%
  rename("I am familiar with LoC estimation" = effort_loc.familiarity) %>%
  rename("I am familiar with ordinal scale (1-10) estimation" = effort_ordinal.scale.familiarity) %>%
  rename("I am familiar with Cosmic FP estimation" = effort_cosmic.fp.familiarity) %>%
  rename("I am familiar with story points estimation" = effort_story.points.familiarity) %>%
  likert() %>%
  plot(type = "bar")
# plot(type = "heat")
# plot(type = "density")

data %>%
  select(contains(".familiarity")) %>%
  summary()
  

# Participants' opinions on the techniques' precision
data %>%
  # optionally filter for most experienced participants
  # filter(demographics_familiarity.scenarios > 2) %>%
  # filter(demographics_familiarity.services > 2) %>%
  # filter(demographics_used.scenarios.before == 1) %>%
  # filter(demographics_years.of.experience > 4) %>%
  select(contains(".precision")) %>%
  mutate(effort_hours.precision = factor(effort_hours.precision, levels = likertLevels, ordered = TRUE, labels = likertLabels)) %>% 
  mutate(effort_loc.precision = factor(effort_loc.precision, levels = likertLevels, ordered = TRUE, labels = likertLabels)) %>% 
  mutate(effort_ordinal.scale.precision = factor(effort_ordinal.scale.precision, levels = likertLevels, ordered = TRUE, labels = likertLabels)) %>% 
  mutate(effort_cosmic.fp.precision = factor(effort_cosmic.fp.precision, levels = likertLevels, ordered = TRUE, labels = likertLabels)) %>% 
  mutate(effort_story.points.precision = factor(effort_story.points.precision, levels = likertLevels, ordered = TRUE, labels = likertLabels)) %>%
  rename("Estimating with hours is precise" = effort_hours.precision) %>%
  rename("Estimating with LoC is precise" = effort_loc.precision) %>%
  rename("Estimating with an ordinal scale (1-10) is precise" = effort_ordinal.scale.precision) %>%
  rename("Estimating with Cosmic FP is precise" = effort_cosmic.fp.precision) %>%
  rename("Estimating with story points is precise" = effort_story.points.precision) %>%
  likert() %>%
  plot(type = "bar", text.size = 4.5, wrap = 30) +
  theme(
    text = element_text(size = 16, face = "bold"),
    legend.title = element_text(size = 0, color = "white"),
    legend.text = element_text(size = 12),
    legend.position =  "right"
  )

data %>%
  select(contains(".precision")) %>%
  summary()


# Participants' opinions on the techniques' applicability to our method
data %>%
  # optionally filter for most experienced participants
  # filter(demographics_familiarity.scenarios > 2) %>%
  # filter(demographics_familiarity.services > 2) %>% 
  # filter(demographics_used.scenarios.before == 1) %>% 
  # filter(demographics_years.of.experience > 4) %>%
  select(contains(".applicability")) %>%
  mutate(effort_hours.applicability = factor(effort_hours.applicability, levels = likertLevels, ordered = TRUE, labels = likertLabels)) %>%
  mutate(effort_loc.applicability = factor(effort_loc.applicability, levels = likertLevels, ordered = TRUE, labels = likertLabels)) %>%
  mutate(effort_ordinal.scale.applicability = factor(effort_ordinal.scale.applicability, levels = likertLevels, ordered = TRUE, labels = likertLabels)) %>%
  mutate(effort_cosmic.fp.applicability = factor(effort_cosmic.fp.applicability, levels = likertLevels, ordered = TRUE, labels = likertLabels)) %>%
  mutate(effort_story.points.applicability = factor(effort_story.points.applicability, levels = likertLevels, ordered = TRUE, labels = likertLabels)) %>%
  rename("Hours are applicable for the method" = effort_hours.applicability) %>%
  rename("LoC are applicable for the method" = effort_loc.applicability) %>%
  rename("An ordinal scale (1-10) is applicable for the method" = effort_ordinal.scale.applicability) %>%
  rename("Cosmic FP are applicable for the method" = effort_cosmic.fp.applicability) %>%
  rename("Story Points are applicable for the method" = effort_story.points.applicability) %>%
  likert() %>%
  plot(type = "bar", text.size = 4.5, wrap = 30) +
  theme(
    text = element_text(size = 16, face = "bold"),
    legend.title = element_text(size = 0, color = "white"),
    legend.text = element_text(size = 12),
    legend.position =  "right"
  )

data %>%
  select(contains(".applicability")) %>%
  summary()


# Evaluation metrics --------

data %>%
  # optionally filter for most experienced participants
  # filter(demographics_familiarity.scenarios > 2) %>%
  # filter(demographics_familiarity.services > 2) %>%
  # filter(demographics_used.scenarios.before == 1) %>%
  # filter(demographics_years.of.experience > 4) %>%
  select(
    evaluation_usefulness.critical.service.most.modified,
    evaluation_usefulness.critical.service.highest.effort,
    evaluation_usefulness.avg.effort.per.scenario,
    evaluation_usefulness.change.impacting.most.services,
    evaluation_usefulness.number.of.affected.services.per.scenario
  ) %>%
  mutate(evaluation_usefulness.critical.service.most.modified = factor(evaluation_usefulness.critical.service.most.modified, levels = likertLevels, ordered = TRUE, labels = likertLabels)) %>%
  mutate(evaluation_usefulness.critical.service.highest.effort = factor(evaluation_usefulness.critical.service.highest.effort, levels = likertLevels, ordered = TRUE, labels = likertLabels)) %>%
  mutate(evaluation_usefulness.avg.effort.per.scenario = factor(evaluation_usefulness.avg.effort.per.scenario, levels = likertLevels, ordered = TRUE, labels = likertLabels)) %>%
  mutate(evaluation_usefulness.change.impacting.most.services = factor(evaluation_usefulness.change.impacting.most.services, levels = likertLevels, ordered = TRUE, labels = likertLabels)) %>%
  mutate(evaluation_usefulness.number.of.affected.services.per.scenario = factor(evaluation_usefulness.number.of.affected.services.per.scenario, levels = likertLevels, ordered = TRUE, labels = likertLabels)) %>%
  rename("Most modified service is a useful metric" = evaluation_usefulness.critical.service.most.modified) %>%
  rename("Service with highest effort is a useful metric" = evaluation_usefulness.critical.service.highest.effort) %>%
  rename("Avg effort / scenario is a useful metric" = evaluation_usefulness.avg.effort.per.scenario) %>%
  rename("Change impacting most services is a useful metric" = evaluation_usefulness.change.impacting.most.services) %>%
  rename("# of affected services / scenario is a useful metric" = evaluation_usefulness.number.of.affected.services.per.scenario) %>%
  likert() %>%
  plot(type = "bar")

data %>%
  select(contains("evaluation_usefulness.")) %>%
  summary()

  
# Correlation matrix for exploration --------

# "pearson" for linear correlation of continuous variables
# "spearman" for rank-based monotonic correlation (with ordinal variables)
corr_mthd = "spearman"
corrMatrix <- 
  data %>% select(-id, -effort_other, -evaluation_other, -demographics_active.field) %>% 
  # optionally filter for most experienced participants
  #filter(demographics_familiarity.scenarios > 2) %>%
  #filter(demographics_familiarity.services > 2) %>% 
  #filter(demographics_used.scenarios.before == 1) %>% 
  #filter(demographics_years.of.experience > 4) %>%
  as.matrix() %>% 
  rcorr(type = corr_mthd)

corrplot(corrMatrix$r, p.mat = corrMatrix$P, method = "circle", type="lower")

# number of filtered participants
data %>% 
  filter(demographics_familiarity.scenarios > 2) %>%
  filter(demographics_familiarity.services > 2) %>% 
  filter(demographics_used.scenarios.before == 1) %>% 
  filter(demographics_years.of.experience > 4) %>%
  nrow()


