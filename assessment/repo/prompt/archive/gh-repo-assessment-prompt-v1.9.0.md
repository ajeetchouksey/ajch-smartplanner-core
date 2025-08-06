
# GitHub Repository Assessment Prompt v1.10.0

**Prompt Version:** v1.10.0

## Assessment Framework Instructions

Conduct a comprehensive GitHub repository assessment using the following methodology and instructions. This prompt provides assessment guidelines only - all structure and formatting is defined in the template.


## Template Usage Instructions


**CRITICAL: Template-First & Automation Approach**

1. **Copilot MUST use the provided PowerShell script `assessment/scripts/auto-generate-assessment.ps1` to extract all required repository metadata and automate report generation and archiving. Manual metadata entry is not permitted unless the script cannot extract a value.**
2. **ALWAYS use the latest template** from: `assessment/templates/gh-repo-assessment-template-v{LATEST_VERSION}.md`
3. **Dynamically determine latest template version** from available files in `assessment/templates/`.
4. **Follow template structure exactly** - do not modify or create custom sections.
5. **After running the script, Copilot MUST automatically fill in ALL assessment findings, recommendations, and status fields for every section of the report, using the provided methodology and best practices, without waiting for user input.**
6. **Copilot MUST replace ALL placeholders (including metadata, findings, recommendations, and statuses) in the template in a single automated step, ensuring the report is fully complete and actionable.**
7. **This process must be fully automated—Copilot should not prompt the user for each step, but instead generate the entire report in one go.**
8. **DO NOT hardcode any structure** in this prompt - template is the single source of truth.
9. **Use icons or emojis only when necessary and keep them to a minimum. Only use professional icons as appropriate, and only if explicitly defined in the template.**

---

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

## Assessment Methodology

...existing code...

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
9. After generating the latest assessment report markdown file, Copilot must move all previous assessment report markdown files (except the latest version) into the archive directory (`assessment/reports/archive/`). Only the most recent assessment report must remain in the main report directory. This is a mandatory Copilot action and not optional.

### Report Generation Instructions

1. **Use Latest Template**: Locate and use the most recent template version from the template directory
2. **Fill All Placeholders**: Replace all template placeholders with actual assessment data
3. **Maintain Structure**: Do not modify template structure or create custom sections
4. **Apply Methodology**: Use the assessment criteria and scoring methodology defined above
5. **Technology Customization**: Adapt findings and recommendations to the specific technology stack
6. **Prioritize Actions**: Ensure recommendations are properly prioritized by risk and impact

### Output Requirements

**Assessment Report Generation:**
- Save assessment report to: `assessment/reports/gh-repo-assessment-v{ASSESSMENT_VERSION}.md`
- Archive any existing reports to: `assessment/reports/archive/`
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
