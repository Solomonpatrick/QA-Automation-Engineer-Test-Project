export const TIMEOUTS = {
  SHORT: 5000,
  MEDIUM: 10000,
  LONG: 20000
};

export const SELECTORS = {
  USER_MENU: '[data-testid="PersonOutlineOutlinedIcon"]',
  SIGN_OUT_BUTTON: 'button:has-text("Sign Out")',
  SIGN_OUT_CONFIRM: '[data-testid="ConfirmedActionButton-dialog-ok"]',
  CHART_TITLE: 'text=RD:702-5151 (614) power & energy',
  DATE_FILTER: '[data-testid="BrainsDateTimeRangeButton"]',  // Updated selector
  LOGIN_EMAIL: 'input[id=":R2ij7ulqjt9kq:"]',
  LOGIN_PASSWORD: 'input[id=":R6jj7ulqjt9kq:"]',
  SIGN_IN_BUTTON: 'button:has-text("Sign In")'
};

export const ROUTES = {
  DASHBOARD_BASE: '/next/dashboards',
  PROFILE: '/next/profile',
  LOGIN: '/next/signin'
};