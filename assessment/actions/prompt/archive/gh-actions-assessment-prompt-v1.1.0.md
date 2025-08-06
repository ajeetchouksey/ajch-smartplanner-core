---
### MANDATORY: Full Automation, Parallel Updates, and Markdown Compliance

- Copilot MUST process the entire assessment report in a single automated batch, updating all sections, tables, and lists in parallel. Do not wait for user consent or feedback between sections. All placeholders, bracketed text, and template comments must be replaced with actionable, repository-specific content.
- For every assessment item, only use the statuses: COMPLIANT, NON-COMPLIANT, PARTIAL, or NOT APPLICABLE. Do not use other status values (e.g., MISSING, N/A, TBD).
- After filling all content, validate and fix all markdown lint errors (including bare URLs, table formatting, headings, and blank lines) before finalizing the report.
- All tables MUST use correct markdown syntax, including header separators and no extra blank lines or trailing separators.
- All URLs in the report MUST be wrapped in angle brackets to avoid bare URL markdown lint errors.
- The delivered report MUST be fully actionable, markdown-compliant, and free of any placeholders, bracketed text, template comments, or instructional text.

### MANDATORY: PowerShell Script Integration

- The PowerShell script `auto-generate-assessment.ps1 -AssessmentType actions` now automatically collects repository metadata and replaces basic placeholders.
- If running the script produces a report with remaining placeholders, Copilot MUST complete the assessment by analyzing the actual GitHub Actions configuration and workflows.
- Copilot MUST validate script output and fill any remaining gaps with actual workflow analysis.
- The combination of script automation + Copilot analysis MUST produce a complete assessment with no placeholders remaining.

---

# Prompt

You are tasked with generating a comprehensive GitHub Actions assessment report using a fully automated, batch-processing workflow. The PowerShell script handles basic data collection, but you must complete the detailed Actions analysis. Follow the steps below in strict order, ensuring each batch completes before moving to the next. No manual intervention is required at any stage.

## GitHub Actions Analysis Requirements

Before generating the assessment, you MUST:

1. **Examine Workflow Configuration**: Review workflow files, triggers, and job definitions
2. **Check Security Settings**: Analyze secrets management, permissions, and security practices
3. **Performance Assessment**: Evaluate workflow efficiency, caching, and resource utilization
4. **Quality Review**: Assess workflow organization, maintainability, and best practices
5. **Compliance Calculation**: Provide realistic compliance percentages based on actual Actions implementation

## PowerShell Script Output Validation

After the script runs:

- Verify all basic placeholders are replaced (workflow counts, dates, repository info, etc.)
- Check if Actions features are accurately detected (secrets, matrix, caching, etc.)
- Validate that workflow metadata is correctly populated
- Ensure Actions compliance metrics are realistic

## Placeholder Replacement Instructions

For every section and subsection above, you MUST:

- Replace ALL placeholders (e.g., [Describe the first security issue.], [CRITICAL_ACTIONS_LIST], [TOTAL_WORKFLOWS], etc.) with actionable, relevant, and specific content based on the Actions analysis.
- Remove all instructional/template comments (e.g., <!-- For multiple issues, use a bullet list. -->).
- If there are no issues for a section, use the provided plain sentence (e.g., "No major security issues detected.").
- Validate and fix all markdown formatting and lint errors, especially in tables and lists.
- Ensure parallel updates: All sections must be updated in a single pass, not sequentially or partially.

## Enforcement

If any placeholder or template/instructional text remains in the output, the assessment is considered incomplete and must be reprocessed until fully compliant.

## Automated Workflow Steps

1. **Run the PowerShell Script**  
    Execute `assessment/scripts/auto-generate-assessment.ps1 -AssessmentType actions` to extract workflow metadata, generate the assessment report, and archive previous versions automatically.

2. **Use the Latest Template**  
    Always select the most recent template from  
    `assessment/actions/template/gh-actions-assessment-template-v{LATEST_VERSION}.md` for consistency and accuracy.

3. **Generate the Report**  
    Replace all placeholders, bracketed text, and template instructions in the assessment template with actionable, repository-specific details in every section, table, and list.  
    For each assessment item, provide a clear status: COMPLIANT, NON-COMPLIANT, PARTIAL, or NOT APPLICABLE.  
    Do not leave any section, table, list, summary, or rating with bracketed placeholders, template text, comments, or incomplete information.  
    If the value is not available from the script, infer a reasonable, context-appropriate value.  
    Copilot MUST scan and update every section, table, and list in parallel for speed, not strictly sequentially.

4. **Save the Report**  
    Save the completed assessment to `assessment/actions/reports/gh-actions-assessment-v{ASSESSMENT_VERSION}.md` and archive any previous versions to `assessment/actions/reports/archive/`.
