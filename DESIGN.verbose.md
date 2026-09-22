---
version: alpha
name: EDS
description: >-
  Equinor Design System, December architecture — contract-driven. GENERATED
  from eds-contracts (the fourth renderer, beside CSS and Figma); edit the
  contracts, not this file. The format has no theming, so colors ship as
  paired tokens (name + name-dark); dimensions are the comfortable-density
  digest — the normative values are the DTCG tokens (see Overview).
colors:
  primary: "oklch(0.5 0.075 204.6)"
  primary-dark: "oklch(0.82 0.071 204.6)"
  on-primary: "oklch(1 0.011 204.6)"
  on-primary-dark: "oklch(0.1 0.001 204.6)"
  canvas: "oklch(0.97 0 0)"
  canvas-dark: "oklch(0.15 0.02 252.5)"
  surface: "oklch(0.999 0 0)"
  surface-dark: "oklch(0.25 0.036 252.5)"
  floating: "oklch(0.999 0 0)"
  floating-dark: "oklch(0.47 0.04 252.5)"
  inverse: "oklch(0.23 0 0)"
  inverse-dark: "oklch(0.99 0.013 243)"
  on-inverse: "oklch(1 0 0)"
  on-inverse-dark: "oklch(0.1 0 243)"
  text: "oklch(0.23 0 0)"
  text-dark: "oklch(0.99 0.013 243)"
  text-subtle: "oklch(0.46 0 0)"
  text-subtle-dark: "oklch(0.91 0.021 243)"
  danger: "oklch(0.5 0.204 21.1)"
  danger-dark: "oklch(0.82 0.193 21.1)"
  focus: "oklch(0.75 0.102 240.7)"
  focus-dark: "oklch(0.61 0.123 240.7)"
  disabled: "oklch(0.91 0 0)"
  disabled-dark: "oklch(0.47 0.04 252.5)"
  bg-accent-canvas: "oklch(0.97 0.013 184.6)"
  bg-accent-canvas-dark: "oklch(0.15 0.002 184.6)"
  bg-accent-fill-emphasis-active: "oklch(0.42 0.057 204.6)"
  bg-accent-fill-emphasis-active-dark: "oklch(0.93 0.044 204.6)"
  bg-accent-fill-emphasis-default: "oklch(0.5 0.075 204.6)"
  bg-accent-fill-emphasis-default-dark: "oklch(0.82 0.071 204.6)"
  bg-accent-fill-emphasis-hover: "oklch(0.44 0.062 204.6)"
  bg-accent-fill-emphasis-hover-dark: "oklch(0.88 0.057 204.6)"
  bg-accent-fill-emphasis-selected: "oklch(0.42 0.057 204.6)"
  bg-accent-fill-emphasis-selected-dark: "oklch(0.93 0.044 204.6)"
  bg-accent-fill-ghost-active: "oklch(0.87 0.029 184.6)"
  bg-accent-fill-ghost-active-dark: "oklch(0.52 0.049 184.6)"
  bg-accent-fill-ghost-hover: "oklch(0.91 0.022 184.6)"
  bg-accent-fill-ghost-hover-dark: "oklch(0.47 0.038 184.6)"
  bg-accent-fill-ghost-selected: "oklch(0.87 0.029 184.6)"
  bg-accent-fill-ghost-selected-dark: "oklch(0.52 0.049 184.6)"
  bg-accent-fill-muted-active: "oklch(0.82 0.04 184.6)"
  bg-accent-fill-muted-active-dark: "oklch(0.58 0.061 184.6)"
  bg-accent-fill-muted-default: "oklch(0.91 0.022 184.6)"
  bg-accent-fill-muted-default-dark: "oklch(0.47 0.038 184.6)"
  bg-accent-fill-muted-hover: "oklch(0.87 0.029 184.6)"
  bg-accent-fill-muted-hover-dark: "oklch(0.52 0.049 184.6)"
  bg-accent-fill-muted-selected: "oklch(0.82 0.04 184.6)"
  bg-accent-fill-muted-selected-dark: "oklch(0.58 0.061 184.6)"
  bg-accent-surface: "oklch(0.999 0.01 184.6)"
  bg-accent-surface-dark: "oklch(0.25 0.006 184.6)"
  bg-canvas: "oklch(0.97 0 0)"
  bg-canvas-dark: "oklch(0.15 0.02 252.5)"
  bg-danger-canvas: "oklch(0.97 0.042 21.1)"
  bg-danger-canvas-dark: "oklch(0.15 0.005 21.1)"
  bg-danger-fill-emphasis-active: "oklch(0.42 0.154 21.1)"
  bg-danger-fill-emphasis-active-dark: "oklch(0.93 0.119 21.1)"
  bg-danger-fill-emphasis-default: "oklch(0.5 0.204 21.1)"
  bg-danger-fill-emphasis-default-dark: "oklch(0.82 0.193 21.1)"
  bg-danger-fill-emphasis-hover: "oklch(0.44 0.168 21.1)"
  bg-danger-fill-emphasis-hover-dark: "oklch(0.88 0.154 21.1)"
  bg-danger-fill-emphasis-selected: "oklch(0.42 0.154 21.1)"
  bg-danger-fill-emphasis-selected-dark: "oklch(0.93 0.119 21.1)"
  bg-danger-fill-ghost-active: "oklch(0.87 0.093 21.1)"
  bg-danger-fill-ghost-active-dark: "oklch(0.52 0.154 21.1)"
  bg-danger-fill-ghost-hover: "oklch(0.91 0.07 21.1)"
  bg-danger-fill-ghost-hover-dark: "oklch(0.47 0.119 21.1)"
  bg-danger-fill-ghost-selected: "oklch(0.87 0.093 21.1)"
  bg-danger-fill-ghost-selected-dark: "oklch(0.52 0.154 21.1)"
  bg-danger-fill-muted-active: "oklch(0.82 0.126 21.1)"
  bg-danger-fill-muted-active-dark: "oklch(0.58 0.193 21.1)"
  bg-danger-fill-muted-default: "oklch(0.91 0.07 21.1)"
  bg-danger-fill-muted-default-dark: "oklch(0.47 0.119 21.1)"
  bg-danger-fill-muted-hover: "oklch(0.87 0.093 21.1)"
  bg-danger-fill-muted-hover-dark: "oklch(0.52 0.154 21.1)"
  bg-danger-fill-muted-selected: "oklch(0.82 0.126 21.1)"
  bg-danger-fill-muted-selected-dark: "oklch(0.58 0.193 21.1)"
  bg-danger-surface: "oklch(0.999 0.032 21.1)"
  bg-danger-surface-dark: "oklch(0.25 0.018 21.1)"
  bg-fill-emphasis-active: "oklch(0.42 0 0)"
  bg-fill-emphasis-active-dark: "oklch(0.93 0.019 243)"
  bg-fill-emphasis-default: "oklch(0.5 0 0)"
  bg-fill-emphasis-default-dark: "oklch(0.82 0.03 243)"
  bg-fill-emphasis-disabled: "oklch(0.91 0 0)"
  bg-fill-emphasis-disabled-dark: "oklch(0.47 0.04 252.5)"
  bg-fill-emphasis-hover: "oklch(0.44 0 0)"
  bg-fill-emphasis-hover-dark: "oklch(0.88 0.024 243)"
  bg-fill-muted-active: "oklch(0.82 0 0)"
  bg-fill-muted-active-dark: "oklch(0.58 0.065 252.5)"
  bg-fill-muted-default: "oklch(0.91 0 0)"
  bg-fill-muted-default-dark: "oklch(0.47 0.04 252.5)"
  bg-fill-muted-disabled: "oklch(0.91 0 0)"
  bg-fill-muted-disabled-dark: "oklch(0.47 0.04 252.5)"
  bg-fill-muted-hover: "oklch(0.87 0 0)"
  bg-fill-muted-hover-dark: "oklch(0.52 0.052 252.5)"
  bg-info-canvas: "oklch(0.97 0.025 240.7)"
  bg-info-canvas-dark: "oklch(0.15 0.003 240.7)"
  bg-info-fill-emphasis-active: "oklch(0.42 0.091 240.7)"
  bg-info-fill-emphasis-active-dark: "oklch(0.93 0.07 240.7)"
  bg-info-fill-emphasis-default: "oklch(0.5 0.12 240.7)"
  bg-info-fill-emphasis-default-dark: "oklch(0.82 0.113 240.7)"
  bg-info-fill-emphasis-hover: "oklch(0.44 0.099 240.7)"
  bg-info-fill-emphasis-hover-dark: "oklch(0.88 0.091 240.7)"
  bg-info-fill-emphasis-selected: "oklch(0.42 0.091 240.7)"
  bg-info-fill-emphasis-selected-dark: "oklch(0.93 0.07 240.7)"
  bg-info-fill-muted-active: "oklch(0.82 0.074 240.7)"
  bg-info-fill-muted-active-dark: "oklch(0.58 0.113 240.7)"
  bg-info-fill-muted-default: "oklch(0.91 0.041 240.7)"
  bg-info-fill-muted-default-dark: "oklch(0.47 0.07 240.7)"
  bg-info-fill-muted-hover: "oklch(0.87 0.055 240.7)"
  bg-info-fill-muted-hover-dark: "oklch(0.52 0.091 240.7)"
  bg-info-fill-muted-selected: "oklch(0.82 0.074 240.7)"
  bg-info-fill-muted-selected-dark: "oklch(0.58 0.113 240.7)"
  bg-info-surface: "oklch(0.999 0.019 240.7)"
  bg-info-surface-dark: "oklch(0.25 0.011 240.7)"
  bg-neutral-canvas: "oklch(0.97 0 0)"
  bg-neutral-canvas-dark: "oklch(0.15 0.02 252.5)"
  bg-neutral-fill-emphasis-active: "oklch(0.42 0 0)"
  bg-neutral-fill-emphasis-active-dark: "oklch(0.93 0.019 243)"
  bg-neutral-fill-emphasis-default: "oklch(0.5 0 0)"
  bg-neutral-fill-emphasis-default-dark: "oklch(0.82 0.03 243)"
  bg-neutral-fill-emphasis-hover: "oklch(0.44 0 0)"
  bg-neutral-fill-emphasis-hover-dark: "oklch(0.88 0.024 243)"
  bg-neutral-fill-emphasis-selected: "oklch(0.42 0 0)"
  bg-neutral-fill-emphasis-selected-dark: "oklch(0.93 0.019 243)"
  bg-neutral-fill-ghost-active: "oklch(0.87 0 0)"
  bg-neutral-fill-ghost-active-dark: "oklch(0.52 0.052 252.5)"
  bg-neutral-fill-ghost-hover: "oklch(0.91 0 0)"
  bg-neutral-fill-ghost-hover-dark: "oklch(0.47 0.04 252.5)"
  bg-neutral-fill-ghost-selected: "oklch(0.87 0 0)"
  bg-neutral-fill-ghost-selected-dark: "oklch(0.52 0.052 252.5)"
  bg-neutral-fill-muted-active: "oklch(0.82 0 0)"
  bg-neutral-fill-muted-active-dark: "oklch(0.58 0.065 252.5)"
  bg-neutral-fill-muted-default: "oklch(0.91 0 0)"
  bg-neutral-fill-muted-default-dark: "oklch(0.47 0.04 252.5)"
  bg-neutral-fill-muted-hover: "oklch(0.87 0 0)"
  bg-neutral-fill-muted-hover-dark: "oklch(0.52 0.052 252.5)"
  bg-neutral-fill-muted-selected: "oklch(0.82 0 0)"
  bg-neutral-fill-muted-selected-dark: "oklch(0.58 0.065 252.5)"
  bg-neutral-surface: "oklch(0.999 0 0)"
  bg-neutral-surface-dark: "oklch(0.25 0.036 252.5)"
  bg-success-canvas: "oklch(0.97 0.03 143)"
  bg-success-canvas-dark: "oklch(0.15 0.004 143)"
  bg-success-fill-emphasis-active: "oklch(0.42 0.111 143)"
  bg-success-fill-emphasis-active-dark: "oklch(0.93 0.086 143)"
  bg-success-fill-emphasis-default: "oklch(0.5 0.146 143)"
  bg-success-fill-emphasis-default-dark: "oklch(0.82 0.139 143)"
  bg-success-fill-emphasis-hover: "oklch(0.44 0.12 143)"
  bg-success-fill-emphasis-hover-dark: "oklch(0.88 0.111 143)"
  bg-success-fill-emphasis-selected: "oklch(0.42 0.111 143)"
  bg-success-fill-emphasis-selected-dark: "oklch(0.93 0.086 143)"
  bg-success-fill-muted-active: "oklch(0.82 0.091 143)"
  bg-success-fill-muted-active-dark: "oklch(0.58 0.139 143)"
  bg-success-fill-muted-default: "oklch(0.91 0.05 143)"
  bg-success-fill-muted-default-dark: "oklch(0.47 0.086 143)"
  bg-success-fill-muted-hover: "oklch(0.87 0.067 143)"
  bg-success-fill-muted-hover-dark: "oklch(0.52 0.111 143)"
  bg-success-fill-muted-selected: "oklch(0.82 0.091 143)"
  bg-success-fill-muted-selected-dark: "oklch(0.58 0.139 143)"
  bg-success-surface: "oklch(0.999 0.023 143)"
  bg-success-surface-dark: "oklch(0.25 0.013 143)"
  bg-surface: "oklch(0.999 0 0)"
  bg-surface-dark: "oklch(0.25 0.036 252.5)"
  bg-warning-canvas: "oklch(0.97 0.03 58.7)"
  bg-warning-canvas-dark: "oklch(0.15 0.004 58.7)"
  bg-warning-fill-emphasis-active: "oklch(0.42 0.11 58.7)"
  bg-warning-fill-emphasis-active-dark: "oklch(0.93 0.085 58.7)"
  bg-warning-fill-emphasis-default: "oklch(0.5 0.145 58.7)"
  bg-warning-fill-emphasis-default-dark: "oklch(0.82 0.138 58.7)"
  bg-warning-fill-emphasis-hover: "oklch(0.44 0.12 58.7)"
  bg-warning-fill-emphasis-hover-dark: "oklch(0.88 0.11 58.7)"
  bg-warning-fill-emphasis-selected: "oklch(0.42 0.11 58.7)"
  bg-warning-fill-emphasis-selected-dark: "oklch(0.93 0.085 58.7)"
  bg-warning-fill-muted-active: "oklch(0.82 0.09 58.7)"
  bg-warning-fill-muted-active-dark: "oklch(0.58 0.138 58.7)"
  bg-warning-fill-muted-default: "oklch(0.91 0.05 58.7)"
  bg-warning-fill-muted-default-dark: "oklch(0.47 0.085 58.7)"
  bg-warning-fill-muted-hover: "oklch(0.87 0.066 58.7)"
  bg-warning-fill-muted-hover-dark: "oklch(0.52 0.11 58.7)"
  bg-warning-fill-muted-selected: "oklch(0.82 0.09 58.7)"
  bg-warning-fill-muted-selected-dark: "oklch(0.58 0.138 58.7)"
  bg-warning-surface: "oklch(0.999 0.023 58.7)"
  bg-warning-surface-dark: "oklch(0.25 0.013 58.7)"
  border-accent-medium: "oklch(0.75 0.058 191.3)"
  border-accent-medium-dark: "oklch(0.61 0.07 191.3)"
  border-accent-strong: "oklch(0.52 0.075 197.9)"
  border-accent-strong-dark: "oklch(0.76 0.077 197.9)"
  border-accent-subtle: "oklch(0.87 0.029 184.6)"
  border-accent-subtle-dark: "oklch(0.47 0.038 184.6)"
  border-danger-medium: "oklch(0.75 0.175 21.1)"
  border-danger-medium-dark: "oklch(0.61 0.209 21.1)"
  border-danger-strong: "oklch(0.52 0.214 21.1)"
  border-danger-strong-dark: "oklch(0.76 0.221 21.1)"
  border-danger-subtle: "oklch(0.87 0.093 21.1)"
  border-danger-subtle-dark: "oklch(0.47 0.119 21.1)"
  border-info-medium: "oklch(0.75 0.102 240.7)"
  border-info-medium-dark: "oklch(0.61 0.123 240.7)"
  border-info-strong: "oklch(0.52 0.125 240.7)"
  border-info-strong-dark: "oklch(0.76 0.13 240.7)"
  border-info-subtle: "oklch(0.87 0.055 240.7)"
  border-info-subtle-dark: "oklch(0.47 0.07 240.7)"
  border-medium: "oklch(0.75 0 0)"
  border-medium-dark: "oklch(0.61 0.058 249.3)"
  border-neutral-medium: "oklch(0.75 0 0)"
  border-neutral-medium-dark: "oklch(0.61 0.058 249.3)"
  border-neutral-strong: "oklch(0.52 0 0)"
  border-neutral-strong-dark: "oklch(0.76 0.048 246.1)"
  border-neutral-subtle: "oklch(0.87 0 0)"
  border-neutral-subtle-dark: "oklch(0.47 0.04 252.5)"
  border-strong: "oklch(0.52 0 0)"
  border-strong-dark: "oklch(0.76 0.048 246.1)"
  border-subtle: "oklch(0.87 0 0)"
  border-subtle-dark: "oklch(0.47 0.04 252.5)"
  border-success-medium: "oklch(0.75 0.125 143)"
  border-success-medium-dark: "oklch(0.61 0.15 143)"
  border-success-strong: "oklch(0.52 0.153 143)"
  border-success-strong-dark: "oklch(0.76 0.159 143)"
  border-success-subtle: "oklch(0.87 0.067 143)"
  border-success-subtle-dark: "oklch(0.47 0.086 143)"
  border-warning-medium: "oklch(0.75 0.124 58.7)"
  border-warning-medium-dark: "oklch(0.61 0.149 58.7)"
  border-warning-strong: "oklch(0.52 0.152 58.7)"
  border-warning-strong-dark: "oklch(0.76 0.157 58.7)"
  border-warning-subtle: "oklch(0.87 0.066 58.7)"
  border-warning-subtle-dark: "oklch(0.47 0.085 58.7)"
  icon-accent: "oklch(0.46 0.066 204.6)"
  icon-accent-dark: "oklch(0.91 0.049 204.6)"
  icon-accent-on-emphasis: "oklch(0.9 0.028 204.6)"
  icon-accent-on-emphasis-dark: "oklch(0.33 0.015 204.6)"
  icon-danger: "oklch(0.46 0.181 21.1)"
  icon-danger-dark: "oklch(0.91 0.133 21.1)"
  icon-danger-on-emphasis: "oklch(0.9 0.075 21.1)"
  icon-danger-on-emphasis-dark: "oklch(0.33 0.042 21.1)"
  icon-info: "oklch(0.46 0.106 240.7)"
  icon-info-dark: "oklch(0.91 0.078 240.7)"
  icon-info-on-emphasis: "oklch(0.9 0.044 240.7)"
  icon-info-on-emphasis-dark: "oklch(0.33 0.025 240.7)"
  icon-neutral: "oklch(0.46 0 0)"
  icon-neutral-dark: "oklch(0.91 0.021 243)"
  icon-neutral-on-emphasis: "oklch(0.9 0 0)"
  icon-neutral-on-emphasis-dark: "oklch(0.33 0.007 243)"
  icon-success: "oklch(0.46 0.13 143)"
  icon-success-dark: "oklch(0.91 0.096 143)"
  icon-success-on-emphasis: "oklch(0.9 0.054 143)"
  icon-success-on-emphasis-dark: "oklch(0.33 0.03 143)"
  icon-warning: "oklch(0.46 0.129 58.7)"
  icon-warning-dark: "oklch(0.91 0.095 58.7)"
  icon-warning-on-emphasis: "oklch(0.9 0.053 58.7)"
  icon-warning-on-emphasis-dark: "oklch(0.33 0.03 58.7)"
  text-accent-strong: "oklch(0.23 0.015 204.6)"
  text-accent-strong-dark: "oklch(0.99 0.03 204.6)"
  text-accent-strong-on-emphasis: "oklch(1 0.011 204.6)"
  text-accent-strong-on-emphasis-dark: "oklch(0.1 0.001 204.6)"
  text-accent-subtle: "oklch(0.46 0.066 204.6)"
  text-accent-subtle-dark: "oklch(0.91 0.049 204.6)"
  text-accent-subtle-on-emphasis: "oklch(0.9 0.028 204.6)"
  text-accent-subtle-on-emphasis-dark: "oklch(0.33 0.015 204.6)"
  text-danger-strong: "oklch(0.23 0.042 21.1)"
  text-danger-strong-dark: "oklch(0.99 0.081 21.1)"
  text-danger-strong-on-emphasis: "oklch(1 0.031 21.1)"
  text-danger-strong-on-emphasis-dark: "oklch(0.1 0.003 21.1)"
  text-danger-subtle: "oklch(0.46 0.181 21.1)"
  text-danger-subtle-dark: "oklch(0.91 0.133 21.1)"
  text-danger-subtle-on-emphasis: "oklch(0.9 0.075 21.1)"
  text-danger-subtle-on-emphasis-dark: "oklch(0.33 0.042 21.1)"
  text-info-strong: "oklch(0.23 0.025 240.7)"
  text-info-strong-dark: "oklch(0.99 0.047 240.7)"
  text-info-strong-on-emphasis: "oklch(1 0.018 240.7)"
  text-info-strong-on-emphasis-dark: "oklch(0.1 0.002 240.7)"
  text-info-subtle: "oklch(0.46 0.106 240.7)"
  text-info-subtle-dark: "oklch(0.91 0.078 240.7)"
  text-info-subtle-on-emphasis: "oklch(0.9 0.044 240.7)"
  text-info-subtle-on-emphasis-dark: "oklch(0.33 0.025 240.7)"
  text-neutral-strong: "oklch(0.23 0 0)"
  text-neutral-strong-dark: "oklch(0.99 0.013 243)"
  text-neutral-strong-on-emphasis: "oklch(1 0 0)"
  text-neutral-strong-on-emphasis-dark: "oklch(0.1 0 243)"
  text-neutral-subtle: "oklch(0.46 0 0)"
  text-neutral-subtle-dark: "oklch(0.91 0.021 243)"
  text-neutral-subtle-on-emphasis: "oklch(0.9 0 0)"
  text-neutral-subtle-on-emphasis-dark: "oklch(0.33 0.007 243)"
  text-strong: "oklch(0.23 0 0)"
  text-strong-dark: "oklch(0.99 0.013 243)"
  text-strong-on-emphasis: "oklch(1 0 0)"
  text-strong-on-emphasis-dark: "oklch(0.1 0 243)"
  text-subtle-on-emphasis: "oklch(0.9 0 0)"
  text-subtle-on-emphasis-dark: "oklch(0.33 0.007 243)"
  text-success-strong: "oklch(0.23 0.03 143)"
  text-success-strong-dark: "oklch(0.99 0.058 143)"
  text-success-strong-on-emphasis: "oklch(1 0.022 143)"
  text-success-strong-on-emphasis-dark: "oklch(0.1 0.002 143)"
  text-success-subtle: "oklch(0.46 0.13 143)"
  text-success-subtle-dark: "oklch(0.91 0.096 143)"
  text-success-subtle-on-emphasis: "oklch(0.9 0.054 143)"
  text-success-subtle-on-emphasis-dark: "oklch(0.33 0.03 143)"
  text-warning-strong: "oklch(0.23 0.03 58.7)"
  text-warning-strong-dark: "oklch(0.99 0.058 58.7)"
  text-warning-strong-on-emphasis: "oklch(1 0.022 58.7)"
  text-warning-strong-on-emphasis-dark: "oklch(0.1 0.002 58.7)"
  text-warning-subtle: "oklch(0.46 0.129 58.7)"
  text-warning-subtle-dark: "oklch(0.91 0.095 58.7)"
  text-warning-subtle-on-emphasis: "oklch(0.9 0.053 58.7)"
  text-warning-subtle-on-emphasis-dark: "oklch(0.33 0.03 58.7)"
  bg-neutral-fill-ghost-default: "transparent"
  bg-accent-fill-ghost-default: "transparent"
  bg-danger-fill-ghost-default: "transparent"
  bg-backdrop: "oklch(0.75 0 0)"
  bg-backdrop-dark: "oklch(0.61 0.058 249.3)"
  bg-disabled: "oklch(0.91 0 0)"
  bg-disabled-dark: "oklch(0.47 0.04 252.5)"
  bg-input: "oklch(0.97 0 0)"
  bg-input-dark: "oklch(0.15 0.02 252.5)"
  bg-inverse: "oklch(0.23 0 0)"
  bg-inverse-dark: "oklch(0.99 0.013 243)"
  border-disabled: "oklch(0.75 0 0)"
  border-disabled-dark: "oklch(0.61 0.058 249.3)"
  border-focus: "oklch(0.75 0.102 240.7)"
  border-focus-dark: "oklch(0.61 0.123 240.7)"
  text-disabled: "oklch(0.75 0 0)"
  text-disabled-dark: "oklch(0.61 0.058 249.3)"
  text-link: "oklch(0.52 0.125 240.7)"
  text-link-dark: "oklch(0.76 0.13 240.7)"
  text-on-inverse: "oklch(1 0 0)"
  text-on-inverse-dark: "oklch(0.1 0 243)"
  text-placeholder: "oklch(0.75 0 0)"
  text-placeholder-dark: "oklch(0.61 0.058 249.3)"
  bg-floating: "oklch(0.999 0 0)"
  bg-floating-dark: "oklch(0.47 0.04 252.5)"
typography:
  body:
    fontFamily: "Inter"
    fontSize: "0.875rem"
    lineHeight: 1.429
  label:
    fontFamily: "Inter"
    fontSize: "0.75rem"
    lineHeight: 1.334
  body-xs:
    fontFamily: "Inter"
    fontSize: "0.65625rem"
    lineHeight-compressed: "12px"
    lineHeight-default: "16px"
  header-xs:
    fontFamily: "Equinor"
    fontSize: "0.75rem"
  body-sm:
    fontFamily: "Inter"
    fontSize: "0.75rem"
    lineHeight-compressed: "12px"
    lineHeight-default: "16px"
  header-sm:
    fontFamily: "Equinor"
    fontSize: "0.84375rem"
  body-md:
    fontFamily: "Inter"
    fontSize: "0.875rem"
    lineHeight-compressed: "16px"
    lineHeight-default: "20px"
  header-md:
    fontFamily: "Equinor"
    fontSize: "1rem"
  body-lg:
    fontFamily: "Inter"
    fontSize: "1rem"
    lineHeight-compressed: "20px"
    lineHeight-default: "24px"
  header-lg:
    fontFamily: "Equinor"
    fontSize: "1.125rem"
  body-xl:
    fontFamily: "Inter"
    fontSize: "1.15625rem"
    lineHeight-compressed: "20px"
    lineHeight-default: "24px"
  header-xl:
    fontFamily: "Equinor"
    fontSize: "1.3125rem"
  body-2xl:
    fontFamily: "Inter"
    fontSize: "1.3125rem"
    lineHeight-compressed: "24px"
    lineHeight-default: "28px"
  header-2xl:
    fontFamily: "Equinor"
    fontSize: "1.5rem"
  body-3xl:
    fontFamily: "Inter"
    fontSize: "1.53125rem"
    lineHeight-compressed: "28px"
    lineHeight-default: "32px"
  header-3xl:
    fontFamily: "Equinor"
    fontSize: "1.75rem"
  body-4xl:
    fontFamily: "Inter"
    fontSize: "1.75rem"
    lineHeight-compressed: "28px"
    lineHeight-default: "36px"
  header-4xl:
    fontFamily: "Equinor"
    fontSize: "2rem"
  body-5xl:
    fontFamily: "Inter"
    fontSize: "2rem"
    lineHeight-compressed: "32px"
    lineHeight-default: "36px"
  header-5xl:
    fontFamily: "Equinor"
    fontSize: "2.28125rem"
  body-6xl:
    fontFamily: "Inter"
    fontSize: "2.3125rem"
    lineHeight-compressed: "36px"
    lineHeight-default: "40px"
  header-6xl:
    fontFamily: "Equinor"
    fontSize: "2.625rem"
rounded:
  none: "0px"
  md: "4px"
  pill: "1000px"
spacing:
  xs: "8px"
  sm: "12px"
  md: "16px"
  lg: "24px"
  spacing-horizontal-4xs: "2px"
  spacing-vertical-4xs: "2px"
  spacing-horizontal-3xs: "4px"
  spacing-vertical-3xs: "4px"
  spacing-horizontal-2xs: "6px"
  spacing-vertical-2xs: "6px"
  spacing-horizontal-xs: "8px"
  spacing-vertical-xs: "8px"
  spacing-horizontal-sm: "12px"
  spacing-vertical-sm: "12px"
  spacing-horizontal-md: "16px"
  spacing-vertical-md: "16px"
  spacing-horizontal-lg: "20px"
  spacing-vertical-lg: "20px"
  spacing-horizontal-xl: "24px"
  spacing-vertical-xl: "24px"
  spacing-horizontal-2xl: "28px"
  spacing-vertical-2xl: "28px"
  spacing-horizontal-3xl: "32px"
  spacing-vertical-3xl: "32px"
  sizing-icon-xs: "16px"
  sizing-icon-sm: "18px"
  sizing-icon-md: "20px"
  sizing-icon-lg: "24px"
  sizing-icon-xl: "28px"
  sizing-icon-2xl: "32px"
  sizing-icon-3xl: "37px"
  sizing-icon-4xl: "42px"
  sizing-icon-5xl: "48px"
  sizing-icon-6xl: "56px"
  sizing-selectable-xs: "20px"
  sizing-selectable-sm: "24px"
  sizing-selectable-md: "36px"
  sizing-selectable-lg: "44px"
  sizing-selectable-xl: "52px"
  sizing-selectable-2xl: "60px"
  spacing-border-radius-rounded: "4px"
components:
  banner-info:
    backgroundColor: "{colors.bg-info-surface}"
    borderColor: "{colors.border-info-subtle}"
    iconColor: "{colors.icon-info}"
    textColor: "{colors.text-info-strong}"
  banner-warning:
    backgroundColor: "{colors.bg-warning-surface}"
    borderColor: "{colors.border-warning-subtle}"
    iconColor: "{colors.icon-warning}"
    textColor: "{colors.text-warning-strong}"
  banner-danger:
    backgroundColor: "{colors.bg-danger-surface}"
    borderColor: "{colors.border-danger-subtle}"
    iconColor: "{colors.icon-danger}"
    textColor: "{colors.text-danger-strong}"
  banner-success:
    backgroundColor: "{colors.bg-success-surface}"
    borderColor: "{colors.border-success-subtle}"
    iconColor: "{colors.icon-success}"
    textColor: "{colors.text-success-strong}"
  button-neutral-primary-default:
    backgroundColor: "{colors.bg-neutral-fill-emphasis-default}"
    iconColor: "{colors.icon-neutral-on-emphasis}"
    textColor: "{colors.text-neutral-strong-on-emphasis}"
    rounded: "{rounded.md}"
  button-neutral-secondary-default:
    backgroundColor: "{colors.bg-neutral-fill-ghost-default}"
    borderColor: "{colors.border-neutral-strong}"
    iconColor: "{colors.icon-neutral}"
    textColor: "{colors.text-neutral-strong}"
    rounded: "{rounded.md}"
  button-neutral-ghost-default:
    backgroundColor: "{colors.bg-neutral-fill-ghost-default}"
    iconColor: "{colors.icon-neutral}"
    textColor: "{colors.text-neutral-strong}"
    rounded: "{rounded.md}"
  button-neutral-ghost-icon-default:
    backgroundColor: "{colors.bg-neutral-fill-ghost-default}"
    iconColor: "{colors.icon-neutral}"
    textColor: "{colors.text-neutral-strong}"
    rounded: "{rounded.pill}"
  button-accent-primary-default:
    backgroundColor: "{colors.bg-accent-fill-emphasis-default}"
    iconColor: "{colors.icon-accent-on-emphasis}"
    textColor: "{colors.text-accent-strong-on-emphasis}"
    rounded: "{rounded.md}"
  button-accent-secondary-default:
    backgroundColor: "{colors.bg-accent-fill-ghost-default}"
    borderColor: "{colors.border-accent-strong}"
    iconColor: "{colors.icon-accent}"
    textColor: "{colors.text-accent-strong}"
    rounded: "{rounded.md}"
  button-accent-ghost-default:
    backgroundColor: "{colors.bg-accent-fill-ghost-default}"
    iconColor: "{colors.icon-accent}"
    textColor: "{colors.text-accent-strong}"
    rounded: "{rounded.md}"
  button-accent-ghost-icon-default:
    backgroundColor: "{colors.bg-accent-fill-ghost-default}"
    iconColor: "{colors.icon-accent}"
    textColor: "{colors.text-accent-strong}"
    rounded: "{rounded.pill}"
  button-danger-primary-default:
    backgroundColor: "{colors.bg-danger-fill-emphasis-default}"
    iconColor: "{colors.icon-danger-on-emphasis}"
    textColor: "{colors.text-danger-strong-on-emphasis}"
    rounded: "{rounded.md}"
  button-danger-secondary-default:
    backgroundColor: "{colors.bg-danger-fill-ghost-default}"
    borderColor: "{colors.border-danger-strong}"
    iconColor: "{colors.icon-danger}"
    textColor: "{colors.text-danger-strong}"
    rounded: "{rounded.md}"
  button-danger-ghost-default:
    backgroundColor: "{colors.bg-danger-fill-ghost-default}"
    iconColor: "{colors.icon-danger}"
    textColor: "{colors.text-danger-strong}"
    rounded: "{rounded.md}"
  button-danger-ghost-icon-default:
    backgroundColor: "{colors.bg-danger-fill-ghost-default}"
    iconColor: "{colors.icon-danger}"
    textColor: "{colors.text-danger-strong}"
    rounded: "{rounded.pill}"
  card:
    backgroundColor: "{colors.bg-surface}"
    borderColor: "{colors.border-neutral-subtle}"
    rounded: "{rounded.md}"
  chip-neutral-muted:
    backgroundColor: "{colors.bg-neutral-fill-muted-default}"
    borderColor: "{colors.border-neutral-medium}"
    iconColor: "{colors.icon-neutral}"
    textColor: "{colors.text-neutral-strong}"
    rounded: "{rounded.pill}"
  chip-neutral-emphasis:
    backgroundColor: "{colors.bg-neutral-fill-emphasis-default}"
    iconColor: "{colors.icon-neutral-on-emphasis}"
    textColor: "{colors.text-neutral-strong-on-emphasis}"
    rounded: "{rounded.pill}"
  chip-accent-muted:
    backgroundColor: "{colors.bg-accent-fill-muted-default}"
    borderColor: "{colors.border-accent-medium}"
    iconColor: "{colors.icon-accent}"
    textColor: "{colors.text-accent-strong}"
    rounded: "{rounded.pill}"
  chip-accent-emphasis:
    backgroundColor: "{colors.bg-accent-fill-emphasis-default}"
    iconColor: "{colors.icon-accent-on-emphasis}"
    textColor: "{colors.text-accent-strong-on-emphasis}"
    rounded: "{rounded.pill}"
  chip-danger-muted:
    backgroundColor: "{colors.bg-danger-fill-muted-default}"
    borderColor: "{colors.border-danger-medium}"
    iconColor: "{colors.icon-danger}"
    textColor: "{colors.text-danger-strong}"
    rounded: "{rounded.pill}"
  chip-danger-emphasis:
    backgroundColor: "{colors.bg-danger-fill-emphasis-default}"
    iconColor: "{colors.icon-danger-on-emphasis}"
    textColor: "{colors.text-danger-strong-on-emphasis}"
    rounded: "{rounded.pill}"
  chip-warning-muted:
    backgroundColor: "{colors.bg-warning-fill-muted-default}"
    borderColor: "{colors.border-warning-medium}"
    iconColor: "{colors.icon-warning}"
    textColor: "{colors.text-warning-strong}"
    rounded: "{rounded.pill}"
  chip-warning-emphasis:
    backgroundColor: "{colors.bg-warning-fill-emphasis-default}"
    iconColor: "{colors.icon-warning-on-emphasis}"
    textColor: "{colors.text-warning-strong-on-emphasis}"
    rounded: "{rounded.pill}"
  chip-success-muted:
    backgroundColor: "{colors.bg-success-fill-muted-default}"
    borderColor: "{colors.border-success-medium}"
    iconColor: "{colors.icon-success}"
    textColor: "{colors.text-success-strong}"
    rounded: "{rounded.pill}"
  chip-success-emphasis:
    backgroundColor: "{colors.bg-success-fill-emphasis-default}"
    iconColor: "{colors.icon-success-on-emphasis}"
    textColor: "{colors.text-success-strong-on-emphasis}"
    rounded: "{rounded.pill}"
  chip-info-muted:
    backgroundColor: "{colors.bg-info-fill-muted-default}"
    borderColor: "{colors.border-info-medium}"
    iconColor: "{colors.icon-info}"
    textColor: "{colors.text-info-strong}"
    rounded: "{rounded.pill}"
  chip-info-emphasis:
    backgroundColor: "{colors.bg-info-fill-emphasis-default}"
    iconColor: "{colors.icon-info-on-emphasis}"
    textColor: "{colors.text-info-strong-on-emphasis}"
    rounded: "{rounded.pill}"
  divider-subtle:
    backgroundColor: "{colors.border-neutral-subtle}"
  divider-medium:
    backgroundColor: "{colors.border-neutral-medium}"
  input:
    backgroundColor: "{colors.bg-input}"
    borderBottomColor: "{colors.border-neutral-medium}"
    iconColor: "{colors.icon-neutral}"
    textColor: "{colors.text-neutral-strong}"
  label:
    textColor: "{colors.text-neutral-subtle}"
  menu-item:
    backgroundColor: "{colors.bg-neutral-fill-ghost-default}"
    iconColor: "{colors.icon-neutral}"
    textColor: "{colors.text-neutral-subtle}"
  menu:
    backgroundColor: "{colors.bg-floating}"
    rounded: "{rounded.md}"
  side-bar-item-false:
    backgroundColor: "{colors.bg-neutral-fill-ghost-default}"
    borderBottomColor: "{colors.border-neutral-subtle}"
    iconColor: "{colors.icon-neutral}"
    textColor: "{colors.text-neutral-subtle}"
  side-bar-sub-item:
    backgroundColor: "{colors.bg-neutral-fill-ghost-default}"
    borderBottomColor: "{colors.border-neutral-subtle}"
    textColor: "{colors.text-neutral-subtle}"
  side-bar-false:
    backgroundColor: "{colors.bg-surface}"
  tab:
    backgroundColor: "{colors.bg-neutral-fill-ghost-default}"
    borderBottomColor: "{colors.border-subtle}"
    textColor: "{colors.text-subtle}"
  table-default:
    backgroundColor: "{colors.bg-surface}"
    textColor: "{colors.text-neutral-strong}"
  tooltip-top-start:
    backgroundColor: "{colors.bg-inverse}"
    textColor: "{colors.text-on-inverse}"
    rounded: "{rounded.md}"
  top-bar:
    backgroundColor: "{colors.bg-surface}"
    borderBottomColor: "{colors.border-neutral-subtle}"
    textColor: "{colors.text-neutral-strong}"
  button-primary:
    backgroundColor: "{colors.primary}"
    textColor: "{colors.on-primary}"
    rounded: "{rounded.md}"
  chip-muted:
    rounded: "{rounded.pill}"
  tooltip:
    backgroundColor: "{colors.inverse}"
    textColor: "{colors.on-inverse}"
    rounded: "{rounded.md}"
---

# EDS — design context for agents

## Overview

EDS is calm, dense-capable and engineered: a working-tool aesthetic for energy-
industry applications, not a marketing site. Neutral surfaces carry the work;
the moss-green accent is spent, not sprinkled.

**Non-negotiables (read these even if you read nothing else):**

1. **Never author a control height.** Heights emerge: `inset × 2 + cap(label)`.
2. **Bind tokens, never raw hex or px** — the only literal allowed is the semantic `0px`.
3. **States change only what they declare**; everything else falls back to resting.
4. **Variants are `data-*` attributes** named after the axis (ADR-0006); omit the attribute for the default value. ARIA attributes carry state
   state and the ancestor mode scopes `data-density` / `data-color-scheme`.
5. **Accent is budgeted**: primary CTA, checked/selected state, focus ring — nothing
   else. When in doubt: neutral, subtle, flat.

This is the VERBOSE variant — every value inlined (the production file is deliberately thin; this one exists so no experiment can be accused of holding back). The normative sources remain:

- tokens (normative): `packages/eds-tokens/tokens/` (DTCG; density + color-scheme modes)
- CSS: `packages/eds-tokens/build/css/` + `packages/eds-contracts/build/*.css`
- contracts (component truth): `packages/eds-contracts/contracts/*.contract.json`
- Figma: 412 variables in 4 collections + generated component sets
- measured preview: `packages/eds-contracts/preview/index.html`

## Modes

Two runtime axes the flat token digest above cannot express (colors ship as
`name` + `name-dark` pairs; dimensions are the comfortable-density values):

- **density** `compact | comfortable | relaxed` — an application-level USER choice;
  never mix densities in one view. Set `data-density` on an ancestor.
- **color-scheme** `light | dark` — the palette flips, aliases are scheme-independent.
  Dark is NOT inverted light: canvas sits below surface in both schemes, and
  elevation becomes lightness (see Elevation & Depth).

## Colors

Usage rules sit NEXT to the families, and the “bound by” column is computed from
which contracts actually reference each family — this whitelist cannot go stale.
A family bound by nothing is not yet licensed for use.

| family | intent | bound by |
| --- | --- | --- |
| `bg-*-fill-emphasis-*` | the filled call-to-action tier | eds.button, eds.chip |
| `bg-*-fill-muted-*` | the quiet opaque fill tier | eds.chip |
| `bg-*-fill-ghost-*` | the ghost ladder — transparent-resting surfaces (hover = step 3, active = step 4) | eds.button, eds.menu-item, eds.side-bar-item, eds.side-bar-sub-item, eds.tab, eds.table |
| `bg-*-surface / bg-*-canvas` | tone surfaces; canvas sits below surface in BOTH schemes | eds.banner |
| `icon-*` | icon ink — the SUBTLE step (icons are graphical objects: APCA Lc60, not Lc90) | eds.banner, eds.button, eds.checkbox, eds.chip, eds.input, eds.menu-item, eds.radio, eds.side-bar-item, eds.switch |
| `text-*-strong / *-on-emphasis` | text ink; on-emphasis variants invert on filled tiers | eds.banner, eds.button, eds.chip, eds.input, eds.label, eds.menu-item, eds.side-bar-item, eds.side-bar-sub-item, eds.tab, eds.table, eds.top-bar |
| `bg-inverse + text-on-inverse` | the inverse surface — a negative panel on either scheme | eds.tooltip |
| `bg-floating` | the ELEVATED surface: white in light; one step ABOVE surface in dark | eds.menu |
| `border-focus` | the focus ring — it REPLACES the border, mirroring :focus-visible | eds.button, eds.card, eds.checkbox, eds.input, eds.menu-item, eds.radio, eds.side-bar-item, eds.side-bar-sub-item, eds.switch, eds.tab |
| `*-disabled` | disabled ink and fill; states only state what changes | eds.button, eds.checkbox, eds.chip, eds.input, eds.menu-item, eds.radio, eds.switch, eds.tab |

## Typography

One UI family (Inter). Sizes come from a modular scale per density; controls use
the COMPRESSED line-height variant so the optical-padding recipe holds. Icons are
glyphs: their layout footprint is the label’s cap box and the ink overflows it
like ascenders and descenders — never resize an icon to “fit”.

## Layout

Numbers, not adjectives. Control heights per density (compact/comfortable/relaxed),
all derived — if you are typing a pixel height you are in the wrong layer:

| contract | heights (px) |
| --- | --- |
| eds.banner | 24 / 36 / 44 |
| eds.button | 24 / 36 / 44 |
| eds.chip | 20 / 24 / 36 |
| eds.input | 24 / 36 / 44 |
| eds.menu-item | 24 / 36 / 44 |
| eds.side-bar-item | 40 / 52 / 60 |
| eds.side-bar-sub-item | 32 / 44 / 52 |
| eds.tab | 36 / 44 / 52 |
| eds.table | 24 / 36 / 44 |
| eds.tooltip | 20 / 24 / 36 |

- Spacing is a golden-ratio ladder; inter-element space belongs to the PARENT
  (gap), never to component margins.
- The selectable ladder is a target-size floor (WCAG 2.5.8: 24px min), not a menu.

## Elevation & Depth

The flashlight principle: in light mode elevation is shadow size (`elevation-low`
for tooltips/menus/popovers, `elevation-high` for dialogs); in dark mode elevation
is surface LIGHTNESS — raised surfaces get lighter (`bg-floating` sits one ladder
step above `surface`) and shadows nearly vanish. Never fake depth with borders.

## Shapes

Default is `border-radius-rounded` (4px). Pill is EARNED, not decorative: chips,
and the round ghost-icon button, where the circle falls out of the geometry
(padding = inset when there is no text). Never round a card corner past `rounded`.

## Components

**Reuse these — do not recreate.** Each exists as generated, dependency-free CSS
(class-based, `@layer eds-components`) and as a generated Figma component set;
both render the same contract:

| contract | version | axes | states |
| --- | --- | --- | --- |
| eds.banner | 0.4.0 | tone(4) | — |
| eds.button | 0.8.0 | tone(3) × variant(4) × size(2) | hover, focus, active, disabled, disabled |
| eds.card | 0.2.0 | — | hover, focus |
| eds.checkbox | 0.2.0 | checked(3) | focus, disabled |
| eds.chip | 0.5.0 | tone(6) × emphasis(2) | hover, active, selected, disabled |
| eds.divider | 0.1.0 | weight(2) | — |
| eds.input | 0.7.0 | — | hover, focus, invalid, disabled |
| eds.label | 0.2.1 | — | — |
| eds.menu-item | 0.3.1 | — | hover, active, selected, focus, disabled |
| eds.menu | 0.3.0 | — | — |
| eds.radio | 0.1.0 | checked(2) | focus, disabled |
| eds.side-bar-item | 0.2.0 | collapsed(2) | hover, active, selected, focus |
| eds.side-bar-sub-item | 0.2.0 | — | hover, active, selected, focus |
| eds.side-bar | 0.4.0 | collapsed(2) | — |
| eds.switch | 0.1.0 | checked(2) | focus, disabled |
| eds.tab | 0.2.0 | — | hover, focus, selected, disabled |
| eds.table | 0.3.0 | size(2) | hover, selected |
| eds.tooltip | 0.3.0 | placement(12) | — |
| eds.top-bar | 0.6.0 | — | — |

### Recipes — resolved state values (comfortable density digest)

Default-variant channels per state; colors as light-dark() pairs. Rest
values for every variant are in the frontmatter recipes above. States
change only what they declare — blank cells fall back to rest.

**eds.banner** (v0.4.0)

| channel | rest |  |
| --- | --- |  |
| `root/gap` | 16px |  |
| `root/background-color` |  |  |
| `root/border-color` |  |  |
| `icon/glyph` | 20px |  |
| `icon/footprint` | {recipe.cap-rounded-md} |  |
| `icon/color` |  |  |
| `message/color` |  |  |
| `dismiss/overhang` | {spacing.spacing-vertical-sm} |  |

**eds.button** (v0.8.0)

| channel | rest | hover | focus | active | disabled | disabled |
| --- | --- | --- | --- | --- | --- | --- |
| `root/gap` | {spacing.spacing-icon-md-gap-horizontal} |  |  |  |  |  |
| `root/radius` | 4px |  |  |  |  |  |
| `root/background-color` |  |  |  |  |  |  |
| `icon/glyph` | 20px |  |  |  |  |  |
| `icon/footprint` | {recipe.cap-rounded-md} |  |  |  |  |  |
| `icon/color` |  |  |  |  | light-dark(oklch(0.75 0 0), oklch(0.61 0.058 249.3)) | light-dark(oklch(0.75 0 0), oklch(0.61 0.058 249.3)) |
| `label/color` |  |  |  |  | light-dark(oklch(0.75 0 0), oklch(0.61 0.058 249.3)) | light-dark(oklch(0.75 0 0), oklch(0.61 0.058 249.3)) |
| `trailing-icon/glyph` | 20px |  |  |  |  |  |
| `trailing-icon/footprint` | {recipe.cap-rounded-md} |  |  |  |  |  |
| `trailing-icon/color` |  |  |  |  | light-dark(oklch(0.75 0 0), oklch(0.61 0.058 249.3)) | light-dark(oklch(0.75 0 0), oklch(0.61 0.058 249.3)) |
| `root/border-color` |  |  |  |  | light-dark(oklch(0.75 0 0), oklch(0.61 0.058 249.3)) | light-dark(oklch(0.75 0 0), oklch(0.61 0.058 249.3)) |

**eds.card** (v0.2.0)

| channel | rest | hover | focus |
| --- | --- | --- | --- |
| `root/gap` | 16px |  |  |
| `root/radius` | 4px |  |  |
| `root/background-color` | light-dark(oklch(0.999 0 0), oklch(0.25 0.036 252.5)) |  |  |
| `root/border-color` | light-dark(oklch(0.87 0 0), oklch(0.47 0.04 252.5)) | light-dark(oklch(0.75 0 0), oklch(0.61 0.058 249.3)) |  |

**eds.checkbox** (v0.2.0)

| channel | rest | focus | disabled |
| --- | --- | --- | --- |
| `glyph-off/glyph` | 24px |  |  |
| `glyph-off/footprint` | {recipe.cap-rounded-md} |  |  |
| `glyph-off/color` | light-dark(oklch(0.46 0.066 204.6), oklch(0.91 0.049 204.6)) |  | light-dark(oklch(0.75 0 0), oklch(0.61 0.058 249.3)) |
| `glyph-on/glyph` | 24px |  |  |
| `glyph-on/footprint` | {recipe.cap-rounded-md} |  |  |
| `glyph-on/color` | light-dark(oklch(0.46 0.066 204.6), oklch(0.91 0.049 204.6)) |  | light-dark(oklch(0.75 0 0), oklch(0.61 0.058 249.3)) |
| `glyph-mixed/glyph` | 24px |  |  |
| `glyph-mixed/footprint` | {recipe.cap-rounded-md} |  |  |
| `glyph-mixed/color` | light-dark(oklch(0.46 0.066 204.6), oklch(0.91 0.049 204.6)) |  | light-dark(oklch(0.75 0 0), oklch(0.61 0.058 249.3)) |

**eds.chip** (v0.5.0)

| channel | rest | hover | active | selected | disabled |
| --- | --- | --- | --- | --- | --- |
| `root/gap` | {spacing.spacing-icon-md-gap-horizontal} |  |  |  |  |
| `root/radius` | 1000px |  |  |  |  |
| `root/background-color` |  |  |  |  | light-dark(oklch(0.91 0 0), oklch(0.47 0.04 252.5)) |
| `icon/glyph` | 18px |  |  |  |  |
| `icon/footprint` | {recipe.cap-rounded-sm} |  |  |  |  |
| `icon/color` |  |  |  |  | light-dark(oklch(0.75 0 0), oklch(0.61 0.058 249.3)) |
| `label/color` |  |  |  |  | light-dark(oklch(0.75 0 0), oklch(0.61 0.058 249.3)) |
| `dismiss/glyph` | 18px |  |  |  |  |
| `dismiss/footprint` | {recipe.cap-rounded-sm} |  |  |  |  |
| `dismiss/color` |  |  |  |  | light-dark(oklch(0.75 0 0), oklch(0.61 0.058 249.3)) |
| `root/border-color` |  |  |  |  |  |

**eds.divider** (v0.1.0)

| channel | rest |  |
| --- | --- |  |
| `root/thickness` | 1px |  |
| `root/background-color` |  |  |

**eds.input** (v0.7.0)

| channel | rest | hover | focus | invalid | disabled |
| --- | --- | --- | --- | --- | --- |
| `root/gap` | {spacing.spacing-icon-md-gap-horizontal} |  |  |  |  |
| `root/underline` | 1px |  |  |  |  |
| `root/background-color` | light-dark(oklch(0.97 0 0), oklch(0.15 0.02 252.5)) |  |  |  | light-dark(oklch(0.91 0 0), oklch(0.47 0.04 252.5)) |
| `root/placeholder-color` | light-dark(oklch(0.75 0 0), oklch(0.61 0.058 249.3)) |  |  |  |  |
| `root/border-bottom-color` | light-dark(oklch(0.75 0 0), oklch(0.61 0.058 249.3)) | light-dark(oklch(0.52 0 0), oklch(0.76 0.048 246.1)) |  | light-dark(oklch(0.52 0.214 21.1), oklch(0.76 0.221 21.1)) | light-dark(oklch(0.75 0 0), oklch(0.61 0.058 249.3)) |
| `icon/glyph` | 20px |  |  |  |  |
| `icon/footprint` | {recipe.cap-rounded-md} |  |  |  |  |
| `icon/color` | light-dark(oklch(0.46 0 0), oklch(0.91 0.021 243)) |  |  | light-dark(oklch(0.46 0.181 21.1), oklch(0.91 0.133 21.1)) | light-dark(oklch(0.75 0 0), oklch(0.61 0.058 249.3)) |
| `value/color` | light-dark(oklch(0.23 0 0), oklch(0.99 0.013 243)) |  |  |  | light-dark(oklch(0.75 0 0), oklch(0.61 0.058 249.3)) |
| `trailing-icon/glyph` | 20px |  |  |  |  |
| `trailing-icon/footprint` | {recipe.cap-rounded-md} |  |  |  |  |
| `trailing-icon/color` | light-dark(oklch(0.46 0 0), oklch(0.91 0.021 243)) |  |  | light-dark(oklch(0.46 0.181 21.1), oklch(0.91 0.133 21.1)) | light-dark(oklch(0.75 0 0), oklch(0.61 0.058 249.3)) |

**eds.label** (v0.2.1)

| channel | rest |  |
| --- | --- |  |
| `label/color` | light-dark(oklch(0.46 0 0), oklch(0.91 0.021 243)) |  |

**eds.menu-item** (v0.3.1)

| channel | rest | hover | active | selected | focus | disabled |
| --- | --- | --- | --- | --- | --- | --- |
| `root/gap` | {spacing.spacing-icon-md-gap-horizontal} |  |  |  |  |  |
| `root/background-color` | transparent | light-dark(oklch(0.91 0 0), oklch(0.47 0.04 252.5)) | light-dark(oklch(0.87 0 0), oklch(0.52 0.052 252.5)) | light-dark(oklch(0.87 0.029 184.6), oklch(0.52 0.049 184.6)) |  |  |
| `icon/glyph` | 20px |  |  |  |  |  |
| `icon/footprint` | {recipe.cap-rounded-md} |  |  |  |  |  |
| `icon/color` | light-dark(oklch(0.46 0 0), oklch(0.91 0.021 243)) |  |  | light-dark(oklch(0.46 0.066 204.6), oklch(0.91 0.049 204.6)) |  | light-dark(oklch(0.75 0 0), oklch(0.61 0.058 249.3)) |
| `label/color` | light-dark(oklch(0.46 0 0), oklch(0.91 0.021 243)) |  |  | light-dark(oklch(0.23 0.015 204.6), oklch(0.99 0.03 204.6)) |  | light-dark(oklch(0.75 0 0), oklch(0.61 0.058 249.3)) |

**eds.menu** (v0.3.0)

| channel | rest |  |
| --- | --- |  |
| `root/radius` | 4px |  |
| `root/background-color` | light-dark(oklch(0.999 0 0), oklch(0.47 0.04 252.5)) |  |
| `root/elevation` | {elevation.low} |  |

**eds.radio** (v0.1.0)

| channel | rest | focus | disabled |
| --- | --- | --- | --- |
| `glyph-off/glyph` | 24px |  |  |
| `glyph-off/footprint` | {recipe.cap-rounded-md} |  |  |
| `glyph-off/color` | light-dark(oklch(0.46 0.066 204.6), oklch(0.91 0.049 204.6)) |  | light-dark(oklch(0.75 0 0), oklch(0.61 0.058 249.3)) |
| `glyph-on/glyph` | 24px |  |  |
| `glyph-on/footprint` | {recipe.cap-rounded-md} |  |  |
| `glyph-on/color` | light-dark(oklch(0.46 0.066 204.6), oklch(0.91 0.049 204.6)) |  | light-dark(oklch(0.75 0 0), oklch(0.61 0.058 249.3)) |

**eds.side-bar-item** (v0.2.0)

| channel | rest | hover | active | selected | focus |
| --- | --- | --- | --- | --- | --- |
| `root/gap` | {spacing.spacing-icon-md-gap-horizontal} |  |  |  |  |
| `root/underline` | 1px |  |  |  |  |
| `root/background-color` | transparent | light-dark(oklch(0.91 0 0), oklch(0.47 0.04 252.5)) | light-dark(oklch(0.87 0 0), oklch(0.52 0.052 252.5)) | light-dark(oklch(0.87 0.029 184.6), oklch(0.52 0.049 184.6)) |  |
| `root/border-bottom-color` | light-dark(oklch(0.87 0 0), oklch(0.47 0.04 252.5)) |  |  | light-dark(oklch(0.52 0.075 197.9), oklch(0.76 0.077 197.9)) |  |
| `icon/glyph` | 20px |  |  |  |  |
| `icon/footprint` | {recipe.cap-rounded-md} |  |  |  |  |
| `icon/color` | light-dark(oklch(0.46 0 0), oklch(0.91 0.021 243)) |  |  | light-dark(oklch(0.46 0.066 204.6), oklch(0.91 0.049 204.6)) |  |
| `label/color` | light-dark(oklch(0.46 0 0), oklch(0.91 0.021 243)) |  |  | light-dark(oklch(0.23 0.015 204.6), oklch(0.99 0.03 204.6)) |  |
| `chevron/glyph` | 20px |  |  |  |  |
| `chevron/footprint` | {recipe.cap-rounded-md} |  |  |  |  |
| `chevron/color` | light-dark(oklch(0.46 0 0), oklch(0.91 0.021 243)) |  |  |  |  |
| `flag/color` | light-dark(oklch(0.46 0 0), oklch(0.91 0.021 243)) |  |  |  |  |

**eds.side-bar-sub-item** (v0.2.0)

| channel | rest | hover | active | selected | focus |
| --- | --- | --- | --- | --- | --- |
| `root/underline` | 1px |  |  |  |  |
| `root/background-color` | transparent | light-dark(oklch(0.91 0 0), oklch(0.47 0.04 252.5)) | light-dark(oklch(0.87 0 0), oklch(0.52 0.052 252.5)) | light-dark(oklch(0.87 0.029 184.6), oklch(0.52 0.049 184.6)) |  |
| `root/border-bottom-color` | light-dark(oklch(0.87 0 0), oklch(0.47 0.04 252.5)) |  |  | light-dark(oklch(0.52 0.075 197.9), oklch(0.76 0.077 197.9)) |  |
| `label/color` | light-dark(oklch(0.46 0 0), oklch(0.91 0.021 243)) |  |  | light-dark(oklch(0.23 0.015 204.6), oklch(0.99 0.03 204.6)) |  |

**eds.side-bar** (v0.4.0)

| channel | rest |  |
| --- | --- |  |
| `root/endline` | 2px |  |
| `root/background-color` | light-dark(oklch(0.999 0 0), oklch(0.25 0.036 252.5)) |  |
| `root/border-right-color` | light-dark(oklch(0.87 0 0), oklch(0.47 0.04 252.5)) |  |

**eds.switch** (v0.1.0)

| channel | rest | focus | disabled |
| --- | --- | --- | --- |
| `glyph-off/glyph` | 32px |  |  |
| `glyph-off/footprint` | {recipe.cap-rounded-md} |  |  |
| `glyph-off/color` | light-dark(oklch(0.46 0.066 204.6), oklch(0.91 0.049 204.6)) |  | light-dark(oklch(0.75 0 0), oklch(0.61 0.058 249.3)) |
| `glyph-on/glyph` | 32px |  |  |
| `glyph-on/footprint` | {recipe.cap-rounded-md} |  |  |
| `glyph-on/color` | light-dark(oklch(0.46 0.066 204.6), oklch(0.91 0.049 204.6)) |  | light-dark(oklch(0.75 0 0), oklch(0.61 0.058 249.3)) |

**eds.tab** (v0.2.0)

| channel | rest | hover | focus | selected | disabled |
| --- | --- | --- | --- | --- | --- |
| `root/background-color` | transparent | light-dark(oklch(0.91 0 0), oklch(0.47 0.04 252.5)) |  |  |  |
| `root/border-bottom-color` | light-dark(oklch(0.87 0 0), oklch(0.47 0.04 252.5)) |  |  | light-dark(oklch(0.75 0.058 191.3), oklch(0.61 0.07 191.3)) |  |
| `label/color` | light-dark(oklch(0.46 0 0), oklch(0.91 0.021 243)) |  |  | light-dark(oklch(0.23 0.015 204.6), oklch(0.99 0.03 204.6)) | light-dark(oklch(0.75 0 0), oklch(0.61 0.058 249.3)) |

**eds.table** (v0.3.0)

| channel | rest | hover | selected |
| --- | --- | --- | --- |
| `root/background-color` | light-dark(oklch(0.999 0 0), oklch(0.25 0.036 252.5)) |  |  |
| `row/background-color` | transparent | light-dark(oklch(0.91 0 0), oklch(0.47 0.04 252.5)) | light-dark(oklch(0.87 0.029 184.6), oklch(0.52 0.049 184.6)) |
| `header-cell/color` | light-dark(oklch(0.23 0 0), oklch(0.99 0.013 243)) |  |  |
| `header-cell/border-bottom-color` | light-dark(oklch(0.75 0 0), oklch(0.61 0.058 249.3)) |  |  |
| `cell/color` | light-dark(oklch(0.23 0 0), oklch(0.99 0.013 243)) |  |  |
| `cell/border-bottom-color` | light-dark(oklch(0.87 0 0), oklch(0.47 0.04 252.5)) |  |  |

**eds.tooltip** (v0.3.0)

| channel | rest |  |
| --- | --- |  |
| `root/radius` | 4px |  |
| `root/background-color` | light-dark(oklch(0.23 0 0), oklch(0.99 0.013 243)) |  |
| `root/elevation` | {elevation.low} |  |
| `label/color` | light-dark(oklch(1 0 0), oklch(0.1 0 243)) |  |

**eds.top-bar** (v0.6.0)

| channel | rest |  |
| --- | --- |  |
| `root/gap` | 16px |  |
| `root/background-color` | light-dark(oklch(0.999 0 0), oklch(0.25 0.036 252.5)) |  |
| `root/border-bottom-color` | light-dark(oklch(0.87 0 0), oklch(0.47 0.04 252.5)) |  |
| `symbol/glyph` | 20px |  |
| `symbol/footprint` | {recipe.cap-rounded-lg} |  |
| `title/color` | light-dark(oklch(0.23 0 0), oklch(0.99 0.013 243)) |  |

Compositions own LAYOUT only — every box belongs to a contract:

- **eds.text-field** — Label + Input + Label

States come from the platform, not classes: `:checked`, `[aria-selected]`,
`:user-invalid`, `:focus-visible`, `:disabled`. Disabled replaces ink and fill
with the `*-disabled` concepts and nothing else.

## Do's and Don'ts

```css
/* DON'T — authored height, baked color, class-driven state */
.my-button { height: 36px; background: #007079; }
.my-button.is-hovered { background: #004f55; }

/* DO — emergent height, bound channel, platform state flips the variable */
.eds-button {
  min-height: calc(var(--_inset-v) * 2 + var(--eds-cap-rounded));
  background-color: var(--_bg);
}
.eds-button:not(:disabled):hover { --_bg: var(--eds-color-bg-accent-fill-emphasis-hover); }
```

```html
<!-- DON'T — rebuild a field from raw elements -->
<div class="field"><span>Label</span><input style="border:1px solid gray"></div>

<!-- DO — the shipped parts and the shipped composition -->
<div class="eds-text-field">
  <label class="eds-label" for="x">Label</label>
  <div class="eds-input"><input class="eds-value" id="x"></div>
</div>
```

Known drift: generated output comes back saturated, rounded and shadowed.
When in doubt: neutral, subtle, flat.

Facts a canvas refuses (from the disposition ledgers — recorded, not dropped):

- **read text is trimmed to the cap box (text-box)** — CSS: text-box: trim-both ex alphabetic + padding-top round(1cap,4px)−1ex on the message (codepen VYmaowY) — the occupied box is exactly the ROUNDED cap and the BASELINE lands on the 4px grid; root padding = the raw inset (@supports-gated; the fallback keeps the half-leading subtraction — one switch flips all of it).
- **state focus** — CSS: :focus-visible — the ring is the PLATFORM's, not a designable state.
- **state disabled for variant=secondary** — The gated tokens change nothing for variant=secondary — the contract refuses to invent a binding it does not have..
- **state disabled for variant=ghost** — The gated tokens change nothing for variant=ghost — the contract refuses to invent a binding it does not have..
- **state disabled for variant=ghost-icon** — The gated tokens change nothing for variant=ghost-icon — the contract refuses to invent a binding it does not have..

