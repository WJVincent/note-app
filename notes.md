# note application

## features

- client side data
        - no server - x
    - data is importable/exportable by the user (WIP)
    - local first data - x
    - indexdb - x
- full text search
    - the goal is to allow notes to link
        - obsidian
        - logseq
        - ect.
    - maybe not full text search
    - maybe just a really tagging system - x
- plain text
    - exportable/importable
    - no special format
    - markdown link no-render syntax
        - ex: "[tags]:- name"
    - markdown support

## Roadmap

- Basic UI
    - note editor
        - start with a styled textarea input - x
        - submit with button click - x
        - maybe add toggle to switch to preview mode (read/write toggle)
            - possibly styling it like in this article. textarea combined with pre/code tags. Write into textarea, view the code/pre tag.
                - syntax highlighting handled by prismjs or something like it
                - https://css-tricks.com/creating-an-editable-textarea-that-supports-syntax-highlighted-code/ 
                - https://prismjs.com/  
    - note viewer
        - all notes
            - default sort by date -x
            - update notes schema to include created/updated at values - x
        - filter
            - by tag - x
            - by date range -?

## Still TODO

- []: full text search
- []: style textarea
