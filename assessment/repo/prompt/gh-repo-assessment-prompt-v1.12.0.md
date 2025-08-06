---

### MANDATORY: Full Automation, Parallel Updates, and Markdown Compliance

- Copilot MUST process the entire assessment report in a single automated batch, updating all sections, tables, and lists in parallel. Do not wait for user consent or feedback between sections. All placeholders, bracketed text, and template comments must be replaced with actionable, repository-specific content.
- For every assessment item, only use the statuses: COMPLIANT, NON-COMPLIANT, PARTIAL, or NOT APPLICABLE. Do not use other status values (e.g., MISSING, N/A, TBD).
- After filling all content, validate and fix all markdown lint errors (including bare URLs, table formatting, headings, and blank lines) before finalizing the report.
- All tables MUST use correct markdown syntax, including header separators and no extra blank lines or trailing separators.
- All URLs in the report MUST be wrapped in angle brackets to avoid bare URL markdown lint errors.
- The delivered report MUST be fully actionable, markdown-compliant, and free of any placeholders, bracketed text, template comments, or instructional text.
---

# Prompt


You are tasked with generating a comprehensive GitHub repository assessment report using a fully automated, batch-processing workflow. Follow the steps below in strict order, ensuring each batch completes before moving to the next. No manual intervention is required at any stage.


## Placeholder Replacement Instructions

For every section and subsection above, you MUST:

- Replace ALL placeholders (e.g., [Describe the first security issue.], [CRITICAL_ACTIONS_LIST], [REPOSITORY_NAME], etc.) with actionable, relevant, and specific content based on the repository analysis.
- Remove all instructional/template comments (e.g., <!-- For multiple issues, use a bullet list. -->).
- If there are no issues for a section, use the provided plain sentence (e.g., "No major security issues detected.").
- Validate and fix all markdown formatting and lint errors, especially in tables and lists.
- Ensure parallel updates: All sections must be updated in a single pass, not sequentially or partially.



## Enforcement

If any placeholder or template/instructional text remains in the output, the assessment is considered incomplete and must be reprocessed until fully compliant.


## Automated Workflow Steps

1. **Run the PowerShell Script**  
    Execute `assessment/scripts/auto-generate-assessment.ps1` to extract repository metadata, generate the assessment report, and archive previous versions automatically.

2. **Use the Latest Template**  
    Always select the most recent template from  
    `assessment/templates/gh-repo-assessment-template-v{LATEST_VERSION}.md` for consistency and accuracy.

3. **Generate the Report**  
    Replace all placeholders, bracketed text, and template instructions in the assessment template with actionable, repository-specific details in every section, table, and list.  
    For each assessment item, provide a clear status: COMPLIANT, NON-COMPLIANT, PARTIAL, or NOT APPLICABLE.  
    Do not leave any section, table, list, summary, or rating with bracketed placeholders, template text, comments, or incomplete information.  
    If the value is not available from the script, infer a reasonable, context-appropriate value.  
    Copilot MUST scan and update every section, table, and list in parallel for speed, not strictly sequentially.  
    The final report MUST be fully filled, actionable, and free of any template or placeholder text.

4. **Save the Report**  
    Store the completed assessment in `assessment/reports/` using the naming format:  
    `gh-repo-assessment-v{ASSESSMENT_VERSION}.md`

5. **Archive Previous Reports**  
    Move all earlier reports to `assessment/reports/archive/`, keeping only the latest version in the main reports directory.

---


### MANDATORY: Final Markdown Validation and Correction

- Validate the entire report for correct markdown formatting (including headings, tables, lists, code blocks, and links).
- Remove all instructional/template text, comments, and placeholder instructions from the final report.
- If any markdown lint errors or formatting issues are detected (e.g., broken tables, inconsistent heading levels, missing code block fences, improper list formatting, duplicate headings, missing blank lines around headings, etc.), Copilot MUST automatically fix them before finalizing the report.
- The delivered report must be fully compliant with markdown standards and render correctly in all major markdown viewers. Always validate the report in a markdown viewer before archiving.
- Copilot MUST update all sections in parallel for efficiency and ensure no markdown errors remain.

---



### MANDATORY: Section-Wide Placeholder Replacement and Parallel Update

- Copilot MUST scan and update every section, table, list, and bullet point in the assessment report for any remaining placeholders, bracketed text, or template instructions (e.g., `[STATUS]`, `[FINDINGS]`, `[RECOMMENDATIONS]`, `[PERCENTAGE]`, `[SUMMARY_REMARKS]`, `[REPOSITORY_TYPE]`, `[CRITICAL_ACTIONS_LIST]`, `[REPOSITORY_NAME]`, `[NEXT_ASSESSMENT_FREQUENCY]`, etc.).
- For every placeholder or bracketed item:
  - Replace it with actionable, repository-specific content in every section, including all summary fields, ratings, and compliance statements.
  - If the value is not available, infer a reasonable, context-appropriate value.
  - Do not leave any section, table, list, summary, rating, or instructional/template text with bracketed placeholders, template text, comments, or incomplete information.
- Copilot MUST apply these changes to all sections, including but not limited to:
  - Executive Summary
  - All tables and lists in Detailed Assessment Analysis
  - Issues, Action Items, Best Practices, and Assessment Information
- Copilot MUST update all sections in parallel for speed and efficiency.
- The final report MUST be fully filled, actionable, and free of any template or placeholder text.


### High-Level Actions

1. Scan every section, table, and list for placeholders and template instructions.
2. Replace all placeholders with actionable, repository-specific values.
3. Update all sections in parallel for efficiency.
4. Validate and correct markdown formatting, ensuring no lint errors remain.
5. Deliver a fully actionable, markdown-compliant assessment report.
