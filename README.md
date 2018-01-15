# jupyter-copyright-statement
Add a copyright statement to the Jupyter notebook interface.

## Installation
```bash
git clone https://github.com/travigd/jupyter-copyright-statement.git
cd ./jupyter-copyright-statement
jupyter nbextension install [--user] ./copyright-statement
```

Then edit or create the file `/etc/jupyter/nbconfig/tree.json` (for the whole system) or `~/.local/jupyter/nbconfig/tree.json` (for only the current user) to look like the following:
```json
{
  "load_extensions": {
    "copyright-statement/main": true
  }
}
