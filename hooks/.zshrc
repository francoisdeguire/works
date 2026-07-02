
# ==============================================================================
# Oh My Zsh
# ==============================================================================

export ZSH="$HOME/.oh-my-zsh"
ZSH_THEME="robbyrussell"
plugins=(git)
source $ZSH/oh-my-zsh.sh

# ==============================================================================
# Path
# ==============================================================================

export PATH="$HOME/.local/bin:$PATH"

# n (Node version manager)
export N_PREFIX="$HOME/n"
[[ :$PATH: == *":$N_PREFIX/bin:"* ]] || PATH+=":$N_PREFIX/bin"

# pnpm
export PNPM_HOME="$HOME/Library/pnpm"
case ":$PATH:" in
  *":$PNPM_HOME:"*) ;;
  *) export PATH="$PNPM_HOME:$PATH" ;;
esac

# bun
export BUN_INSTALL="$HOME/.bun"
export PATH="$BUN_INSTALL/bin:$PATH"

# Android SDK
export JAVA_HOME=/Library/Java/JavaVirtualMachines/zulu-17.jdk/Contents/Home
export ANDROID_HOME="$HOME/Library/Android/sdk"
export PATH="$PATH:$ANDROID_HOME/emulator"
export PATH="$PATH:$ANDROID_HOME/platform-tools"

# ==============================================================================
# Environment
# ==============================================================================

export PGHOST="localhost"
export CLAUDE_CODE_DISABLE_ADAPTIVE_THINKING=1

# ==============================================================================
# Version Managers & Completions
# ==============================================================================

source ~/.nvm/nvm.sh
[ -s "$HOME/.bun/_bun" ] && source "$HOME/.bun/_bun"

# ==============================================================================
# Zsh Plugins (must be near the end)
# ==============================================================================

source $(brew --prefix)/share/zsh-autosuggestions/zsh-autosuggestions.zsh
source $(brew --prefix)/share/zsh-syntax-highlighting/zsh-syntax-highlighting.zsh

# ==============================================================================
# Aliases
# ==============================================================================

# Git
alias gs="git status"
alias gc="git commit -am"
alias gp="git push"

# Navigation
alias ..="cd .."
alias ...="cd ../.."
alias ~="cd ~"
alias cdgit="cd ~/Documents/GitHub"

# Editor & Config
alias zshconfig="zed ~/.zshrc"
alias zshreload="omz reload"
alias claudeconfig="zed ~/.claude.json"

# Claude — work account (separate ~/.claude-work config dir, own keychain entry)
# Syncs MCP servers from ~/.claude/shared-mcp.json into the work config, then launches.
ccw() {
  ~/.claude/sync-mcp.sh ~/.claude-work >/dev/null
  CLAUDE_CONFIG_DIR=~/.claude-work command claude "$@"
}

# Quick Open
alias o="open ."
alias z="zed ."

# Terminal Tools
alias lg="lazygit"
alias y="yazi"

# ==============================================================================
# Functions
# ==============================================================================

# Yeet: commit staged files (no verify) + push
yeet() {
  git commit --no-verify -m "$*" && git push
}

# Yeetall: stage everything, commit (no verify) + push
yeetall() {
  git add . && git commit --no-verify -m "$*" && git push
}

# tp: Terminal Project switcher (uses fzf)
tp() {
  local project_dir="$HOME/Documents/GitHub"
  local project

  if [[ -n "$1" ]]; then
    project="$1"
  else
    project=$(ls "$project_dir" | fzf --prompt="project> " --height=40% --reverse --color=hl:#4493F8,hl+:#4493F8,pointer:#4493F8)
    [[ -z "$project" ]] && return 0
  fi

  if [[ ! -d "$project_dir/$project" ]]; then
    echo "No project found at $project_dir/$project"
    return 1
  fi

  cd "$project_dir/$project"
}
