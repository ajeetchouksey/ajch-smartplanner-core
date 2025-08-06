

# GitHub Repository Assessment Prompt v1.11.1

**Prompt Version:** v1.11.1


## 1. Introduction & Scope

This prompt defines the methodology, automation, and quality requirements for a comprehensive GitHub repository assessment. All output structure and formatting is controlled by the template.

---

## 2. Path, Output, and Versioning Requirements

**IMPORTANT: Output Path Configuration**

- **Assessment Reports**: Save to `assessment/reports/` (relative to repository root)
- **Archive Reports**: Move old reports to `assessment/reports/archive/`
- **Template Location**: Use template from `assessment/templates/gh-repo-assessment-template-v{LATEST_VERSION}.md`
- **Scripts**: Use automation scripts from `assessment/scripts/`
- **Framework Documentation**: Reference `assessment/framework/` folder for usage instructions

**IMPORTANT: Assessment Versioning Requirements**

- Use semantic versioning format: MAJOR.MINOR.PATCH
- MAJOR: Significant framework changes or complete restructuring
- MINOR: New analysis categories, significant template changes, or additional features
- PATCH: Bug fixes, minor improvements, or clarifications
- Assessment version MUST be updated on every run based on the nature of changes
- **Assessment report filename format**: `gh-repo-assessment-v{ASSESSMENT_VERSION}.md` (WITHOUT date or repository name)
- **Assessment frequency**: Use "weekly (recommended) / fortnight" format
- Framework version must be dynamically determined from latest available version

---

## 3. Template Usage & Automation Requirements

- Always use the latest assessment template from `assessment/templates/gh-repo-assessment-template-v{LATEST_VERSION}.md`. The template controls all report structure and formatting.
- All assessment content must be generated and filled automatically by Copilot, following the template exactly—no custom sections or modifications are allowed.
- For every assessment outcome, the status must be one of the following (case-insensitive): COMPLIANT, NON-COMPLIANT, PARTIAL, or NOT APPLICABLE. No other status values are permitted. Ensure this is enforced throughout the report.
- All placeholders in the template (metadata, findings, recommendations, statuses, action items, best practices, summaries, compliance scores, etc.) must be replaced with actionable, repository-specific content in a single automated step.
- Copilot must not prompt the user for any step; the entire report must be generated and filled automatically.
- After generating the latest assessment report, all previous reports (except the latest version) must be moved to the archive directory (`assessment/reports/archive/`).
- The assessment report filename must follow the format: `gh-repo-assessment-v{ASSESSMENT_VERSION}.md` (without date or repository name).
- All output must be saved to `assessment/reports/` and strictly follow the template structure.


**MANDATORY: Copilot Automation Requirement**

Copilot MUST, in a single automated step and without any user intervention, auto-generate the full, completed assessment content for all sections of the assessment report. This includes:

1. Use the provided PowerShell script to extract all required repository metadata and automate report generation and archiving. Manual metadata entry is not permitted unless the script cannot extract a value.
2. ALWAYS use the latest template from `assessment/templates/gh-repo-assessment-template-v{LATEST_VERSION}.md`.
3. Dynamically determine latest template version from available files in `assessment/templates/`.
4. Follow template structure exactly—do not modify or create custom sections.
5. After running the script, Copilot MUST automatically generate and fill in ALL sections of the assessment report—including detailed findings, recommendations, status fields, action items, best practices checklist, summary, and any other required sections—using the provided methodology and best practices, without waiting for user input.
6. For every assessment section and table, Copilot MUST remove all template placeholder rows (such as those with [STATUS], [FINDINGS], [RECOMMENDATIONS], etc.) and only output the fully filled, actionable tables. No placeholder or template header rows should remain in the final report.
   - For the 'Specific Issues Affecting Compliance Ratings' section and its subsections, Copilot MUST output multiple issues as a bullet list, and use a single plain sentence if there are no issues. Do not use bracketed placeholders or leave any section with only a single bracketed line. This ensures clean, professional markdown formatting for both single and multiple issues, matching the template.
7. Copilot MUST NOT include any template/process instructions, automation notes, or empty lines at the top of the final report. Only actionable assessment content should appear in the delivered report.
8. Copilot MUST replace ALL placeholders (including metadata, findings, recommendations, statuses, action items, best practices, and summary) in the template in a single automated step, ensuring the report is fully complete and actionable.
9. This process must be fully automated—Copilot should not prompt the user for any step, but instead generate the entire, fully filled report in one go, every time.
10. DO NOT hardcode any structure in this prompt—template is the single source of truth.
11. Use icons or emojis only when necessary and keep them to a minimum. Only use professional icons as appropriate, and only if explicitly defined in the template.

---


## 5. Section-Specific Copilot Instructions

...existing code...


## Copilot Stepwise Assessment Report Filling Instructions (MANDATORY)

To ensure Copilot can reliably fill all assessment values in the report without context or length issues, follow these explicit, sequential batch instructions. Copilot MUST process the report in small, ordered batches, line by line or section by section, until all placeholders are replaced and the report is fully actionable:

### Stepwise Batch Instructions

**YOU as co pilot have user consent to run all the following steps. DO NOT ASK FOR User CONSENT, Procced directly**

1. **Preparation**
   - Identify the latest assessment report markdown file in `assessment/reports/` (e.g., `gh-repo-assessment-v*.md`).
   - Open the report for editing.

2. **Batch 1: Metadata Section**
   - Locate the metadata section at the top of the report.
   - For each metadata field (e.g., Repository Name, Type, URL, Visibility, Owner, Default Branch, Assessment Date, Technology Stack, Compliance Level, Security Priority, Automation Priority):
     - If the field contains a placeholder (e.g., `[REPO_NAME]`, `TBD`, or similar), replace it with the actual value extracted by the script or inferred by Copilot.
     - Ensure no field is left blank or with a placeholder.

3. **Batch 2: Repository Overview**
   - Find the Repository Overview section.
   - For each line or table cell with a placeholder, fill in the actionable, repository-specific value.
   - Remove any template header rows or instructional lines.

4. **Batch 3: Executive Summary**

- Locate the Executive Summary section.
- Replace all placeholders with concise, actionable content based on the assessment findings.
- Replace `[PERCENTAGE]`, `[STATUS]`, `[CRITICAL_COUNT]`, and similar placeholders with Copilot-generated, actionable content.
- Ensure the summary is clear, relevant, and free of template/process instructions.

5. **Batch 4: Assessment Methodology**
   - Find the Assessment Methodology section.
   - For each step or subsection, replace placeholders (`[ANALYSIS_METHODOLOGY]`, `[FEATURES_REVIEW_METHODOLOGY]`, `[SECURITY_METHODOLOGY]`, `[WORKFLOW_METHODOLOGY]`,`[DOCUMENTATION_METHODOLOGY]`,`[COLLABORATION_METHODOLOGY]`,`[VERSIONING_METHODOLOGY]`)with detailed, actionable methodology steps.
   - Ensure the methodology is specific to the current assessment and fully completed.

6. **Batch 5: Detailed Assessment Analysis**
   - For each assessment category and subcategory table:
     - Replace `[STATUS]`, `[FINDINGS]`, `[RECOMMENDATIONS]`, and similar placeholders with Copilot-generated, actionable content.
     - Remove any template header rows or instructional lines.
     - Ensure all status indicators use only: COMPLIANT, NON-COMPLIANT, PARTIAL, or NOT APPLICABLE.

7. **Batch 6: Specific Issues Affecting Compliance Ratings**
   - Locate this section and its subsections.
   - For each issue:
     - If multiple issues, output as a bullet list.
     - If no issues, use a single plain sentence.
     - Remove all placeholders and template lines.

8. **Batch 7: Implementation Roadmap and Recommendations**
   - Fill in all roadmap phases and recommendations with specific, actionable, and prioritized content.
   - Remove any remaining placeholders or instructional lines.

9. **Batch 8: Final Quality Assurance**
   - Systematically scan the entire report for any remaining placeholders, template header rows, or instructional/process lines.
   - Replace or remove them as required.
   - Ensure the report is clean, fully filled, and only contains actionable assessment content.

10. **Batch 9: Archiving**
    - Move all previous assessment report markdown files (except the latest version) into the archive directory (`assessment/reports/archive/`).
    - Only the most recent assessment report should remain in the main report directory.

Copilot MUST follow these steps in order, processing the report in small, manageable batches, and repeat the scan/fill process as needed until every section and table is fully filled and no placeholders or template/process lines remain. This approach is mandatory for every assessment run.

## Copilot Archiving Script (Mandatory)

**After generating the latest assessment report, Copilot must perform the following steps in order:**

1. Identify all markdown files in `assessment/reports/` matching `gh-repo-assessment-v*.md`.
2. Determine the latest assessment report by version number.
3. For every other assessment report markdown file (except the latest version), move it to `assessment/reports/archive/`.
4. Only the most recent assessment report must remain in the main report directory.
5. This archiving process is mandatory and must be executed every time a new assessment is generated.

---
- **Use text-only status indicators** (e.g., "COMPLIANT", "NON-COMPLIANT", "PARTIAL", "NOT APPLICABLE")
- **Dynamically determine latest template version** from available files

## Path References for Reusability

**IMPORTANT: Output Path Configuration**

- **Assessment Reports**: Save to `assessment/reports/` (relative to repository root)
- **Archive Reports**: Move old reports to `assessment/reports/archive/`
- **Template Location**: Use template from `assessment/templates/gh-repo-assessment-template-v{LATEST_VERSION}.md`
- **Scripts**: Use automation scripts from `assessment/scripts/`
- **Framework Documentation**: Reference `assessment/framework/` folder for usage instructions

## Assessment Version Management

**IMPORTANT: Assessment Versioning Requirements**

- Use semantic versioning format: MAJOR.MINOR.PATCH
- MAJOR: Significant framework changes or complete restructuring
- MINOR: New analysis categories, significant template changes, or additional features
- PATCH: Bug fixes, minor improvements, or clarifications
- Assessment version MUST be updated on every run based on the nature of changes
- **Assessment report filename format**: `gh-repo-assessment-v{ASSESSMENT_VERSION}.md` (WITHOUT date or repository name)
- **Assessment frequency**: Use "weekly (recommended) / fortnight" format
- Framework version must be dynamically determined from latest available version


## Section-Specific Copilot Instructions

### Repository Overview
- The Repository Overview section must be fully completed for every assessment.
- Copilot must infer and fill all metadata fields, including Technology Stack, Compliance Level, Security Priority, Automation Priority, Repository Name, Type, URL, Visibility, Owner, Default Branch, and Assessment Date.
- No field may be left as TBD, blank, or with a placeholder.
- All values must be specific, actionable, and based on the repository’s actual characteristics.
- Use the automation script to extract metadata wherever possible; only infer values if the script cannot retrieve them.
- Ensure the overview is concise, accurate, and formatted according to the latest template.
- Do not add extra commentary or modify the template structure.
- Review all overview fields for completeness and correctness before finalizing the report.

### Assessment Scope
- The Assessment Scope section must clearly define the boundaries and focus of the assessment, based on the latest template.
- Only include aspects explicitly referenced in the template or assessment methodology.
- Do not add extra commentary or modify the template structure.

### Executive Summary
- The Executive Summary must deliver a concise, high-level overview of the repository’s current state, highlighting key strengths, critical risks, and prioritized recommendations.
- All content must be directly based on actual findings, evidence, and compliance scores from the assessment.
- Copilot MUST replace every placeholder in the Executive Summary section and its subsections with specific, actionable, and repository-relevant content—no placeholders, generic statements, or template/process instructions may remain in the final summary.
- The Executive Summary must be fully completed in a single automated step, without requiring any user input or follow-up.
- Do not add extra commentary, icons, or modify the template structure in any way.
- Ensure the summary is clear, accurate, and directly aligned with the assessment findings, compliance ratings, and recommendations.
- Review the completed Executive Summary for completeness, relevance, and consistency with the rest of the assessment report before finalizing.

### Assessment Methodology
- The Assessment Methodology section and all its subsections must provide a clear, step-by-step description of the automated process, criteria, and tools used to perform the repository assessment.
- All content must be tailored to the current framework and template, with every placeholder replaced by detailed, actionable methodology steps.
- The methodology must be completed in a single automated step, without requiring user input, and must not include extra commentary, icons, or template modifications.
- Each step should be reviewed for clarity, accuracy, and alignment with the assessment framework before finalizing the report.

### Detailed Assessment Analysis
- The Detailed Assessment Analysis must provide a comprehensive, section-by-section evaluation of the repository, including all required findings, compliance statuses, recommendations, and supporting evidence.
- All content must be specific to the assessed repository, based on actual findings, evidence, and compliance scores from the assessment.
- Copilot MUST replace every placeholder in the Detailed Assessment Analysis section and its subsections with actual, assessed values—no placeholders, generic statements, or template instructions may remain in the final content.
- Each assessment category and subcategory must include clear findings, status indicators (COMPLIANT, NON-COMPLIANT, PARTIAL, NOT APPLICABLE), and actionable recommendations.
- All recommendations must be specific, prioritized, and tailored to the repository’s technology stack and context.
- Do not add extra commentary, icons, or modify the template structure.
- Review all analysis content for clarity, accuracy, and alignment with the assessment findings before finalizing the report.
- The analysis must be fully completed in a single automated step, with no user input required.
- Ensure all compliance scores and status indicators are calculated and presented according to the defined methodology and template requirements.

### Specific Issues Affecting Compliance Ratings
- The "Specific Issues Affecting Compliance Ratings" section must provide a detailed, actionable analysis of any issues that have a direct impact on the repository’s compliance scores.
- All content must be specific to the assessed repository, based on actual findings and evidence from the assessment.
- Copilot MUST replace every placeholder in this section and its subsections with actual, assessed values—no placeholders, generic statements, or template instructions may remain in the final content.
- Each identified issue must include a clear description, supporting evidence, and its direct impact on compliance ratings.
- Recommendations must be specific, actionable, and prioritized according to risk and compliance impact.
- Do not add extra commentary, icons, or modify the template structure.
- Review all content for clarity, accuracy, and alignment with the assessment findings before finalizing the report.
- The analysis must be fully completed in a single automated step, with no user input required.
- Ensure all compliance impacts and status indicators are calculated and presented according to the defined methodology and template requirements.


## Assessment Scope

The assessment covers all aspects of the target GitHub repository as defined by the latest assessment template. This includes, but is not limited to:

- Repository metadata and configuration
- Codebase structure and technology stack
- Security controls and compliance measures
- Automation and CI/CD workflows
- Documentation quality and completeness
- Issue and pull request management practices
- Branching and release strategies
- Best practices adherence and actionable recommendations

All findings and recommendations must be based on the repository’s current state at the time of assessment. The scope is strictly limited to the repository and its direct dependencies; external systems or unrelated repositories are excluded unless explicitly referenced in the template or assessment methodology.
## Executive Summary Section Instructions

### MANDATORY: Executive Summary Completion Requirement

> The following instructions apply to this section and all of its subsections.
>
> The Executive Summary must deliver a concise, high-level overview of the repository’s current state, highlighting key strengths, critical risks, and prioritized recommendations.

- All content in the Executive Summary must be directly based on the actual findings, evidence, and compliance scores from the assessment.
- Copilot MUST replace every placeholder in the Executive Summary section and its subsections with specific, actionable, and repository-relevant content—no placeholders, generic statements, or template/process instructions may remain in the final summary.
- The Executive Summary must be fully completed in a single automated step, without requiring any user input or follow-up.
- Do not add extra commentary, icons, or modify the template structure in any way.
- Ensure the summary is clear, accurate, and directly aligned with the assessment findings, compliance ratings, and recommendations.
- Copilot MUST strictly follow the template and ensure all placeholders are replaced with actual, assessed values in the Executive Summary section and all its subsections.
- Review the completed Executive Summary for completeness, relevance, and consistency with the rest of the assessment report before finalizing.

## Assessment Methodology

## Repository Analysis Process

1. **Repository Discovery & Context Gathering**
   - Examine repository structure, files, and configuration
   - Identify technology stack and repository type
   - Determine repository visibility and ownership
   - Assess repository size, activity, and maturity

2. **Security Configuration Review**
   - Check GitHub security settings and policies
   - Evaluate branch protection rules and access controls
   - Assess secret management and vulnerability scanning
   - Review security policy documentation and practices

3. **Code Quality & Standards Assessment**
   - Evaluate code standards, formatting, and consistency
   - Assess testing coverage and quality practices
   - Review documentation and code comments
   - Check dependency management and review processes

4. **Automation & Workflow Analysis**
   - Assess CI/CD pipeline implementation and effectiveness
   - Review GitHub Actions workflows and automation
   - Evaluate deployment processes and strategies
   - Check monitoring, observability, and error handling

5. **Documentation & Knowledge Management**
   - Review documentation quality, completeness, and organization
   - Assess README, API docs, and project documentation
   - Evaluate wiki usage and knowledge sharing practices
   - Check documentation maintenance and version control

   The assessment was conducted using a fully automated, script-driven process to ensure accuracy, repeatability, and objectivity. The following methodology was applied:

1. **Automated Metadata Extraction:**  
    The PowerShell script `assessment/scripts/auto-generate-assessment.ps1` was executed to extract all relevant repository metadata, including configuration, technology stack, branch structure, and workflow details.

2. **Template-Driven Report Generation:**  
    The latest assessment template was dynamically identified from `assessment/templates/`, ensuring alignment with the most current assessment structure and requirements.

3. **Comprehensive Section Analysis:**  
    Each assessment category and subcategory defined in the template was evaluated using automated checks and evidence gathered from the repository. Findings, compliance statuses, and recommendations were generated based on actual repository data.

4. **Compliance Scoring:**  
    Compliance scores were calculated using the defined weighting methodology, with each section’s status (COMPLIANT, NON-COMPLIANT, PARTIAL, NOT APPLICABLE) determined by objective criteria and supporting evidence.

5. **Actionable Recommendations:**  
    All recommendations were tailored to the repository’s technology stack and prioritized by risk and impact, ensuring practical and relevant guidance.

6. **Quality Assurance:**  
    The completed report was automatically reviewed to confirm that all placeholders were replaced, all sections were fully populated, and the report strictly followed the template structure.

7. **Archiving and Version Management:**  
    Previous assessment reports were archived according to the defined process, ensuring only the latest report remained in the main directory. Assessment and template versions were managed using semantic versioning.

This methodology ensures that every assessment is comprehensive, consistent, and fully aligned with the latest framework and best practices.

### Documentation Assessment Criteria

**Documentation Quality and Completeness:**

- Comprehensive project documentation covering all aspects
- API documentation available and up-to-date (if applicable)

- Clear setup and installation guides for different environments
- Architecture documentation explaining system design
- Changelog maintained with version history
- Wiki utilized effectively for additional documentation
- Documentation kept current with code changes
- Multiple documentation formats supported as needed

### Risk Assessment Framework

**Identify and classify risks in these categories:**

- **Security Risks**: Vulnerabilities, access control issues, exposed secrets
- **Operational Risks**: Process gaps, automation failures, deployment issues
- **Compliance Risks**: Policy violations, governance gaps, audit findings
- **Technical Debt**: Code quality issues, outdated dependencies, maintenance burden

### Implementation Roadmap Guidelines

**Create prioritized action plan with phases:**

- **Phase 1 (Critical)**: Security vulnerabilities and compliance issues requiring immediate attention
- **Phase 2 (High Priority)**: Process improvements, automation gaps, and significant quality issues
- **Phase 3 (Medium Priority)**: Enhancement opportunities, optimization, and workflow improvements
- **Phase 4 (Low Priority)**: Long-term repository maturity and community features

### Assessment Categories & Weighting

**Core Assessment Areas (Used in Overall Compliance Calculation):**

- **Repository Structure & Organization**: 20% weight
- **Security & Access Control**: 25% weight (highest priority)
- **Code Quality & Standards**: 20% weight
- **Workflows & Automation**: 20% weight
- **Documentation & Knowledge Management**: 10% weight
- **Collaboration & Community Features**: Optional enhancement (not counted in overall)

### Methodology Completion Requirement

The Assessment Methodology section and all its subsections must provide a clear, step-by-step description of the automated process, criteria, and tools used to perform the repository assessment. All content must be tailored to the current framework and template, with every placeholder replaced by detailed, actionable methodology steps. The methodology must be completed in a single automated step, without requiring user input, and must not include extra commentary, icons, or template modifications. Each step should be reviewed for clarity, accuracy, and alignment with the assessment framework before finalizing the report. All methodology steps must be specific, actionable, and directly aligned with the assessment framework and template requirements, ensuring the section and its subsections are fully completed and compliant.

> The following instructions apply to all subsections within this section.
>
> The Assessment Methodology section must clearly describe the step-by-step process, criteria, and tools used to perform the repository assessment.

- All content must be specific to the assessment process defined by the current framework and template.
- Copilot MUST replace every placeholder in the Assessment Methodology section and its subsections with actual, detailed methodology steps—no placeholders, generic statements, or template instructions may remain in the final content.
- The methodology must be fully completed in a single automated step, with no user input required.
- Do not add extra commentary, icons, or modify the template structure.
- Review the methodology for clarity, accuracy, and alignment with the assessment framework before finalizing the report.
- Copilot MUST strictly follow the template and ensure all placeholders are replaced with actual, detailed methodology content in this section and its subsections.

---
## Detailed Assessment Analysis Section Instructions

### MANDATORY: Detailed Assessment Analysis Completion Requirement

> The following instructions apply to this section and all of its subsections.
>
> The Detailed Assessment Analysis must provide a comprehensive, section-by-section evaluation of the repository, including all required findings, compliance statuses, recommendations, and supporting evidence.

- All content must be specific to the assessed repository, based on actual findings, evidence, and compliance scores from the assessment.
- Copilot MUST replace every placeholder in the Detailed Assessment Analysis section and its subsections with actual, assessed values—no placeholders, generic statements, or template instructions may remain in the final content.
- Each assessment category and subcategory must include clear findings, status indicators (COMPLIANT, NON-COMPLIANT, PARTIAL, NOT APPLICABLE), and actionable recommendations.
- All recommendations must be specific, prioritized, and tailored to the repository’s technology stack and context.
- Do not add extra commentary, icons, or modify the template structure.
- Review all analysis content for clarity, accuracy, and alignment with the assessment findings before finalizing the report.
- Copilot MUST strictly follow the template and ensure all placeholders are replaced with actual, actionable content in this section and its subsections.
- The analysis must be fully completed in a single automated step, with no user input required.
- Ensure all compliance scores and status indicators are calculated and presented according to the defined methodology and template requirements.
...existing code...

### MANDATORY: Specific Issues Affecting Compliance Ratings Completion Requirement

> The following instructions apply to this section and all of its subsections.
>
> The "Specific Issues Affecting Compliance Ratings" section must provide a detailed, actionable analysis of any issues that have a direct impact on the repository’s compliance scores.

- All content must be specific to the assessed repository, based on actual findings and evidence from the assessment.
- Copilot MUST replace every placeholder in this section and its subsections with actual, assessed values—no placeholders, generic statements, or template instructions may remain in the final content.
- Each identified issue must include a clear description, supporting evidence, and its direct impact on compliance ratings.
- Recommendations must be specific, actionable, and prioritized according to risk and compliance impact.
- Do not add extra commentary, icons, or modify the template structure.
- Review all content for clarity, accuracy, and alignment with the assessment findings before finalizing the report.
- Copilot MUST strictly follow the template and ensure all placeholders are replaced with actual, actionable content in this section and its subsections.
- The analysis must be fully completed in a single automated step, with no user input required.
- Ensure all compliance impacts and status indicators are calculated and presented according to the defined methodology and template requirements.

### GitHub-Specific Recommendations

**Focus on GitHub-native features and integrations:**

- Advanced security features (Advanced Security, CodeQL, secret scanning)
- GitHub Apps and marketplace tools integration
- Actions and automation opportunities specific to GitHub
- Project management features (Projects, Issues, Milestones)
- Community and collaboration features (Discussions, Wiki, Pages)

**Before finalizing the assessment, you must:**

1. Ensure all compliance scores are calculated using the defined weighting methodology.
2. Populate every required template section with complete, relevant findings.
3. Provide recommendations that are specific, actionable, and prioritized by risk and impact.
4. Maintain correct markdown formatting and strictly follow the template structure.
5. Confirm all findings, scores, and recommendations are consistent and cross-referenced.
6. Apply technology-specific guidance that matches the detected stack.
7. Replace every placeholder in the template—including all metadata, findings, recommendations, statuses, action items, best practices, summaries, and compliance scores (such as [REPO_NAME], [REPO_TYPE], [TECH_STACK], [COMPLIANCE_LEVEL], [SECURITY_PRIORITY], [AUTOMATION_PRIORITY], [ASSESSMENT_VERSION], [ASSESSMENT_DATE], [REPO_URL], [PUBLIC/PRIVATE], [OWNER_NAME], [DEFAULT_BRANCH], [STATUS], [FINDINGS], [RECOMMENDATIONS], [PERCENTAGE], [SUMMARY_REMARKS], etc.)—with the actual, Copilot-generated value. Do not leave any placeholder unreplaced.
8. For every assessment outcome, the status must be one of the following (case-insensitive): COMPLIANT, NON-COMPLIANT, PARTIAL, or NOT APPLICABLE. No other status values are permitted. Ensure this is enforced throughout the report.
9. After generating or updating the assessment report, Copilot MUST scan all sections (including detailed assessment tables and summary lines) for any remaining placeholders (such as [STATUS], [FINDINGS], [RECOMMENDATIONS], [PERCENTAGE], [SUMMARY_REMARKS], or similar). Copilot MUST update only those lines containing unreplaced placeholders, ensuring all actionable content is Copilot-generated and no placeholders remain in the final report. This action is mandatory and must be performed every time, regardless of previous partial fills or context changes. The final report MUST NOT contain any placeholder tokens—every section and table must be fully filled with actionable, relevant content.
10. After generating the latest assessment report markdown file, Copilot must move all previous assessment report markdown files (except the latest version) into the archive directory (`assessment/reports/archive/`). Only the most recent assessment report must remain in the main report directory. This is a mandatory Copilot action and not optional.

### Copilot Assessment Execution Instructions (MANDATORY)

1. **Use Latest Template**: Dynamically locate and use the most recent template version from `assessment/templates/`.
2. **Extract Metadata**: Run the provided PowerShell script to extract all required repository metadata. Infer any value only if the script cannot extract it.
3. **Fill All Placeholders**: Replace every placeholder (metadata, findings, recommendations, statuses, action items, best practices, summaries, compliance scores, etc.) in the template with Copilot-generated, actionable content. No placeholder may remain.
4. **Maintain Structure**: Do not modify the template structure or create custom sections. Follow the template exactly.
5. **Apply Methodology**: Use the assessment criteria and scoring methodology defined in this prompt and the template.
6. **Technology Customization**: Adapt findings and recommendations to the detected technology stack.
7. **Prioritize Actions**: Ensure recommendations are prioritized by risk and impact.
8. **Compliance Status**: For every assessment outcome, use only: COMPLIANT, NON-COMPLIANT, PARTIAL, or NOT APPLICABLE.
9. **Archive Old Reports**: After generating the latest assessment report, move all previous assessment report markdown files (except the latest version) into the archive directory. Only the most recent report must remain in the main report directory.
10. **Versioning**: Use semantic versioning for the assessment version based on changes made. Template version and assessment version may differ.
11. **Output Path**: Save the assessment report to `assessment/reports/gh-repo-assessment-v{ASSESSMENT_VERSION}.md` and archive old reports to `assessment/reports/archive/`.
12. **Quality Assurance**: Before finalizing, scan all sections for any remaining placeholders and update only those lines. Ensure all findings, scores, and recommendations are consistent, cross-referenced, and actionable. No template/process instructions or empty lines should appear in the final report.
 13. **MANDATORY POST-PROCESSING**: After generating the assessment report, Copilot MUST systematically scan every section, table, and line for any remaining placeholders (such as `[STATUS]`, `[FINDINGS]`, `[RECOMMENDATIONS]`, `[PERCENTAGE]`, `[SUMMARY_REMARKS]`, `[ASSESSOR_NAME]`, `[ANALYSIS_METHODOLOGY]`, `TBD`, etc.) or template header rows. Copilot MUST immediately and automatically replace any detected placeholders or "TBD" values with specific, actionable, Copilot-generated content, based on the repository's actual state and the assessment methodology. This post-processing step is mandatory and must be performed every time, regardless of previous partial fills or context changes. The final report MUST NOT contain any placeholder tokens, template header rows, or instructional/process lines—every section and table must be fully filled with actionable, relevant content. This post-processing is a required, non-optional Copilot action for every assessment run.
13. **Schedule Recommendation**: Recommend regular assessment schedules based on repository criticality and change frequency.

---

*This assessment prompt is specifically designed for GitHub repositories and focuses on GitHub-native features, security controls, and collaboration tools. All output structure and formatting is controlled by the template. Assessment version should be incremented based on the nature of framework changes.*
- Regular assessment schedules should be recommended based on repository criticality and change frequency


### Repository Structure Assessment Criteria

**Evaluate the following elements:**
- Clear project organization and logical file structure
- Comprehensive README with project description, setup, and usage
- Proper documentation hierarchy and organization
- Configuration files properly organized (.gitignore, package files, etc.)
- License file present and appropriate for project
- Contributing guidelines and code of conduct (where applicable)
- Issue and PR templates configured appropriately
- Security policy and governance documentation

### Security Assessment Criteria

**GitHub Security Features to Evaluate:**
- Branch protection rules configured for default branch
- Required reviews setup for protected branches with appropriate reviewers
- Status checks required before merging with proper configuration
- Force pushes and deletions restricted appropriately
- Secret scanning enabled and configured
- Vulnerability alerts and Dependabot security updates enabled
- Code scanning (CodeQL/SAST) implemented where applicable
- Private vulnerability reporting enabled for public repositories
- Two-factor authentication enforcement for contributors
- Repository permissions and access control properly managed

### Code Quality Assessment Criteria

**Code Standards and Review Process:**
- Consistent code formatting and style across the codebase
- Comprehensive test coverage with quality test practices
- Adequate documentation and meaningful code comments
- Dependency management following best practices
- Code review process documented and enforced
- Linting and formatting tools configured and automated
- Pre-commit hooks setup where appropriate
- Quality gates integrated into CI/CD pipeline

### Workflow & Automation Assessment Criteria

**CI/CD and Automation Evaluation:**
- CI/CD pipeline implemented with appropriate stages
- Automated testing on pull requests with comprehensive coverage
- Automated deployments configured with proper environments
- GitHub Actions workflows following security best practices
- Workflow permissions following least privilege principle
- Automated dependency updates and security scanning
- Performance monitoring and error tracking integrated
- Rollback capabilities and deployment safety measures

### Documentation Assessment Criteria

**Documentation Quality and Completeness:**
- Comprehensive project documentation covering all aspects
- API documentation available and up-to-date (if applicable)
- Clear setup and installation guides for different environments
- Architecture documentation explaining system design
- Changelog maintained with version history
- Wiki utilized effectively for additional documentation
- Documentation kept current with code changes
- Multiple documentation formats supported as needed


### Risk Assessment Framework

**Identify and classify risks in these categories:**

- **Security Risks**: Vulnerabilities, access control issues, exposed secrets
- **Operational Risks**: Process gaps, automation failures, deployment issues
- **Compliance Risks**: Policy violations, governance gaps, audit findings
- **Technical Debt**: Code quality issues, outdated dependencies, maintenance burden


### Implementation Roadmap Guidelines

**Create prioritized action plan with phases:**

- **Phase 1 (Critical)**: Security vulnerabilities and compliance issues requiring immediate attention
- **Phase 2 (High Priority)**: Process improvements, automation gaps, and significant quality issues
- **Phase 3 (Medium Priority)**: Enhancement opportunities, optimization, and workflow improvements
- **Phase 4 (Low Priority)**: Long-term repository maturity and community features


### GitHub-Specific Recommendations

**Focus on GitHub-native features and integrations:**

- Advanced security features (Advanced Security, CodeQL, secret scanning)
- GitHub Apps and marketplace tools integration
- Actions and automation opportunities specific to GitHub
- Project management features (Projects, Issues, Milestones)
- Community and collaboration features (Discussions, Wiki, Pages)


### Quality Assurance Checklist

**Before finalizing the assessment, you must:**

1. Ensure all compliance scores are calculated using the defined weighting methodology.
2. Populate every required template section with complete, relevant findings.
3. Provide recommendations that are specific, actionable, and prioritized by risk and impact.
4. Maintain correct markdown formatting and strictly follow the template structure.
5. Confirm all findings, scores, and recommendations are consistent and cross-referenced.
6. Apply technology-specific guidance that matches the detected stack.
7. Replace every metadata placeholder in the template (such as [REPO_NAME], [REPO_TYPE], [TECH_STACK], [COMPLIANCE_LEVEL], [SECURITY_PRIORITY], [AUTOMATION_PRIORITY], [ASSESSMENT_VERSION], [ASSESSMENT_DATE], [REPO_URL], [PUBLIC/PRIVATE], [OWNER_NAME], [DEFAULT_BRANCH]) with the actual repository value. Do not leave any placeholder unreplaced.
8. For every assessment outcome, the status must be one of the following (case-insensitive): COMPLIANT, NON-COMPLIANT, PARTIAL, or NOT APPLICABLE. No other status values are permitted. Ensure this is enforced throughout the report.
9. After generating the latest assessment report markdown file, Copilot must move all previous assessment report markdown files (except the latest version) into the archive directory (`assessment_compliance_reports/repository/archive/`). Only the most recent assessment report must remain in the main report directory. This is a mandatory Copilot action and not optional.



### Output Requirements

**Assessment Report Generation:**
- Save assessment report to: `assessment_compliance_reports/repository/gh-repo-assessment-v{ASSESSMENT_VERSION}.md`
- Archive any existing reports to: `assessment_compliance_reports/repository/archive/`
- Use semantic versioning for assessment version based on changes made
- Include comprehensive findings for all assessment categories
- Provide specific, actionable recommendations with implementation guidance
- Calculate accurate compliance scores using defined weighting methodology

### Final Notes

- This prompt focuses on methodology and assessment criteria only
- All output structure and formatting is controlled by the template
- Assessment version should be incremented based on the nature of framework changes
- Template version and assessment version may differ - template controls structure, assessment version tracks methodology changes
- Regular assessment schedules should be recommended based on repository criticality and change frequency

---

*This assessment prompt is specifically designed for GitHub repositories and focuses on GitHub-native features, security controls, and collaboration tools. The prompt provides methodology only - all structure is defined in the referenced template.*
