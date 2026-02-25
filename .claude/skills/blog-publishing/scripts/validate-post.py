#!/usr/bin/env python3
"""
Blog post validation script for fabiorehm.com
Checks for common issues before publishing
"""

import sys
import re
from pathlib import Path
from datetime import datetime

def validate_post(filepath):
    """Validate a blog post file"""
    path = Path(filepath)
    
    if not path.exists():
        print(f"❌ File not found: {filepath}")
        return False
    
    content = path.read_text()
    issues = []
    warnings = []
    
    # Check for TODOs
    todos = re.findall(r'TODO\(@\w+\):[^\n]*', content)
    if todos:
        issues.append(f"Found {len(todos)} TODO comments:")
        for todo in todos[:3]:  # Show first 3
            issues.append(f"  - {todo}")
        if len(todos) > 3:
            issues.append(f"  ... and {len(todos) - 3} more")
    
    # Check frontmatter
    frontmatter_match = re.match(r'^---\n(.*?)\n---', content, re.DOTALL)
    if not frontmatter_match:
        issues.append("Missing frontmatter")
        return False
    
    frontmatter = frontmatter_match.group(1)
    
    # Required fields
    required = ['title', 'date', 'description']
    for field in required:
        if not re.search(rf'^{field}:', frontmatter, re.MULTILINE):
            issues.append(f"Missing required field: {field}")
    
    # Check if draft
    is_draft = re.search(r'^draft:\s*true', frontmatter, re.MULTILINE)
    if not is_draft:
        warnings.append("Not marked as draft - ready to publish?")
    
    # Check date format
    date_match = re.search(r'^date:\s*(\d{4}-\d{2}-\d{2})', frontmatter, re.MULTILINE)
    if date_match:
        try:
            post_date = datetime.strptime(date_match.group(1), '%Y-%m-%d')
            now = datetime.now()
            if post_date > now:
                warnings.append(f"Future date: {date_match.group(1)}")
        except ValueError:
            issues.append(f"Invalid date format: {date_match.group(1)}")

    # Check location (drafts vs blog vs notes)
    path_str = str(path.parent)
    path_parts = path_str.split('/')
    is_draft_note = 'drafts' in path_parts and 'notes' in path_parts
    if is_draft_note:
        warnings.append("Note is in /drafts/notes/ - remember to move to /notes/slug/ when publishing")
    elif 'notes' in path_parts:
        warnings.append("Note is already in /notes/ - is this an update or republish?")
    elif 'drafts' in path_parts:
        warnings.append("Post is in /drafts/ - remember to move to /blog/YYYY/MM/DD/slug/ when publishing")
    elif 'blog' in path_parts:
        warnings.append("Post is already in /blog/ - is this an update or republish?")
    else:
        issues.append("Post is not in a recognized content location (/drafts/, /blog/, /notes/)")

    # Check AI provenance for notes
    is_note = is_draft_note or ('notes' in path_parts and 'drafts' not in path_parts)
    has_ai_assisted = re.search(r'^ai_assisted:\s*true', frontmatter, re.MULTILINE)
    if is_note and has_ai_assisted:
        ai_desc = re.search(r'^ai_description:', frontmatter, re.MULTILINE)
        if not ai_desc:
            warnings.append("AI-assisted note missing ai_description field")
        elif 'TODO' in (ai_desc.group(0) if ai_desc else ''):
            issues.append("ai_description still has a TODO - fill it in before publishing")

    # Check directory structure matches post slug
    parent_dir = path.parent.name
    title_match = re.search(r'^title:\s*"?([^"\n]+)"?', frontmatter, re.MULTILINE)
    if title_match:
        title = title_match.group(1)
        # Generate expected slug from title
        expected_slug = re.sub(r'[^\w\s-]', '', title.lower())
        expected_slug = re.sub(r'[\s_]+', '-', expected_slug)

        if parent_dir != expected_slug:
            warnings.append(f"Directory '{parent_dir}' doesn't match expected slug '{expected_slug}' from title")
    
    # Report results
    print(f"\n📝 Validating: {path.name}")
    print("=" * 60)
    
    if issues:
        print("\n❌ Issues found:")
        for issue in issues:
            print(f"  {issue}")
    
    if warnings:
        print("\n⚠️  Warnings:")
        for warning in warnings:
            print(f"  {warning}")
    
    if not issues and not warnings:
        print("\n✅ All checks passed!")
    
    print("\n" + "=" * 60)
    
    return len(issues) == 0

if __name__ == "__main__":
    if len(sys.argv) != 2:
        print("Usage: python validate-post.py <path-to-post>")
        sys.exit(1)
    
    success = validate_post(sys.argv[1])
    sys.exit(0 if success else 1)
