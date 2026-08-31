/**
 * Software Engineering Process Knowledge Base
 * Markdown Renderer, Template Engine & Export Utilities
 */

const MarkdownParser = {
    /**
     * Lightweight and secure Markdown to HTML renderer
     */
    render(md) {
        if (!md) return "";

        let html = md;

        // Escape HTML entities to prevent XSS except for basic markdown constructs
        html = html
            .replace(/&/g, "&amp;")
            .replace(/</g, "&lt;")
            .replace(/>/g, "&gt;");

        // Code blocks with syntax formatting
        html = html.replace(/```([a-zA-Z0-9_-]*)\n([\s\S]*?)```/g, (match, lang, code) => {
            const languageBadge = lang ? `<span class="code-lang">${lang}</span>` : "";
            return `<div class="code-block-wrapper">${languageBadge}<pre><code class="language-${lang || 'text'}">${code.trim()}</code></pre></div>`;
        });

        // Inline code
        html = html.replace(/`([^`]+)`/g, '<code class="inline-code">$1</code>');

        // Headers (h1 to h4)
        html = html.replace(/^#### (.*$)/gim, '<h4 class="wiki-h4" id="$1">$1</h4>');
        html = html.replace(/^### (.*$)/gim, '<h3 class="wiki-h3" id="$1">$1</h3>');
        html = html.replace(/^## (.*$)/gim, '<h2 class="wiki-h2" id="$1">$1</h2>');
        html = html.replace(/^# (.*$)/gim, '<h1 class="wiki-h1" id="$1">$1</h1>');

        // Horizontal rules
        html = html.replace(/^(?:---|\*\*\*|___)\s*$/gim, '<hr class="wiki-hr" />');

        // Blockquotes & Callouts
        html = html.replace(/^\> (.*$)/gim, '<blockquote class="wiki-blockquote"><div class="quote-content">$1</div></blockquote>');

        // Tables
        html = html.replace(/((?:\|(?:[^\n]+)\|(?:\r?\n)?)+)/g, (match) => {
            const rows = match.trim().split("\n");
            if (rows.length < 2) return match;

            let tableHtml = '<div class="table-container"><table class="wiki-table">';
            rows.forEach((row, idx) => {
                const cleanRow = row.trim().replace(/^\||\|$/g, "");
                const cols = cleanRow.split("|").map(c => c.trim());

                // Skip markdown separator row like | :--- | :--- |
                if (cols.every(c => /^:?-+:?$/.test(c))) {
                    return;
                }

                if (idx === 0) {
                    tableHtml += "<thead><tr>";
                    cols.forEach(col => {
                        tableHtml += `<th>${col}</th>`;
                    });
                    tableHtml += "</tr></thead><tbody>";
                } else {
                    tableHtml += "<tr>";
                    cols.forEach(col => {
                        tableHtml += `<td>${col}</td>`;
                    });
                    tableHtml += "</tr>";
                }
            });
            tableHtml += "</tbody></table></div>";
            return tableHtml;
        });

        // Checklist items: - [ ] or - [x]
        html = html.replace(/^\s*-\s*\[([ xX])\]\s*(.*$)/gim, (match, checked, text) => {
            const isChecked = checked.toLowerCase() === "x";
            return `<li class="wiki-task-item ${isChecked ? 'completed' : ''}"><input type="checkbox" disabled ${isChecked ? 'checked' : ''}/> <span>${text}</span></li>`;
        });

        // Unordered lists (- item or * item)
        html = html.replace(/^\s*[\-\*]\s+(.*$)/gim, '<li class="wiki-list-item">$1</li>');

        // Wrap consecutive list items in <ul>
        html = html.replace(/((?:<li class="(?:wiki-list-item|wiki-task-item)[^"]*">.*?<\/li>\s*)+)/gim, '<ul class="wiki-ul">$1</ul>');

        // Ordered lists (1. item)
        html = html.replace(/^\s*\d+\.\s+(.*$)/gim, '<li class="wiki-ol-item">$1</li>');
        html = html.replace(/((?:<li class="wiki-ol-item">.*?<\/li>\s*)+)/gim, '<ol class="wiki-ol">$1</ol>');

        // Bold and Italic
        html = html.replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>');
        html = html.replace(/\*([^*]+)\*/g, '<em>$1</em>');

        // Markdown links [text](url)
        html = html.replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2" target="_blank" rel="noopener noreferrer" class="wiki-link">$1 <span class="ext-icon">↗</span></a>');

        // Paragraphs (double newlines)
        const paragraphs = html.split(/\n\s*\n/);
        html = paragraphs.map(p => {
            p = p.trim();
            if (!p) return "";
            // If already wrapped in HTML block tags, return as is
            if (/^(<h[1-6]|<div|<table|<ul|<ol|<blockquote|<hr|<pre)/i.test(p)) {
                return p;
            }
            return `<p class="wiki-p">${p.replace(/\n/g, "<br/>")}</p>`;
        }).join("\n");

        return html;
    }
};

const TemplateEngine = {
    /**
     * Interpolate fields in template content
     * @param {string} content - Markdown content with {FIELD_KEY}
     * @param {Object} values - Key-value map of user inputs
     */
    interpolate(content, values = {}) {
        if (!content) return "";
        let interpolated = content;
        for (const [key, val] of Object.entries(values)) {
            const regex = new RegExp(`\\{${key}\\}`, "g");
            interpolated = interpolated.replace(regex, val || `[${key}]`);
        }
        return interpolated;
    },

    /**
     * Download content as a markdown (.md) file
     */
    downloadMarkdown(filename, content) {
        const cleanFilename = filename.toLowerCase().replace(/[^a-z0-9_-]/g, "_") + ".md";
        const blob = new Blob([content], { type: "text/markdown;charset=utf-8" });
        const url = URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.href = url;
        link.download = cleanFilename;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url);
    },

    /**
     * Copy text to clipboard with user feedback
     */
    async copyToClipboard(text, triggerElement = null, customFeedback = "Copied to clipboard!") {
        try {
            await navigator.clipboard.writeText(text);
            if (triggerElement) {
                const originalText = triggerElement.innerHTML;
                triggerElement.innerHTML = `<span class="copied-badge">✓ ${customFeedback}</span>`;
                triggerElement.classList.add("btn-success-anim");
                setTimeout(() => {
                    triggerElement.innerHTML = originalText;
                    triggerElement.classList.remove("btn-success-anim");
                }, 2000);
            }
            return true;
        } catch (err) {
            console.error("Clipboard copy failed", err);
            // Fallback using textarea
            const textarea = document.createElement("textarea");
            textarea.value = text;
            textarea.style.position = "fixed";
            textarea.style.opacity = "0";
            document.body.appendChild(textarea);
            textarea.select();
            document.execCommand("copy");
            document.body.removeChild(textarea);
            if (triggerElement) {
                triggerElement.innerHTML = `<span>✓ ${customFeedback}</span>`;
                setTimeout(() => { triggerElement.innerHTML = originalText; }, 2000);
            }
            return true;
        }
    }
};

window.MarkdownParser = MarkdownParser;
window.TemplateEngine = TemplateEngine;
