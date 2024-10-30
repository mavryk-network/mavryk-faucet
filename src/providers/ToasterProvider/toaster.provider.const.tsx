// Toaster statuses
export const TOASTER_SUCCESS = "success";
export const TOASTER_ERROR = "error";
export const TOASTER_WARNING = "warning";
export const TOASTER_INFO = "info";
// icon helper
export const TOAST_ICON_MAPPER = {
  [TOASTER_SUCCESS]: "checkCircle",
  [TOASTER_ERROR]: "cancel",
  [TOASTER_WARNING]: "warnInfo",
  [TOASTER_INFO]: "toastInfo",
};

// consts
export const TOAST_TIME_TO_LIVE = 4600;
export const ANIMATION_DURATION = 400;
export const TOASTS_LIMIT = 5;

// animations
export const TOASTER_HIDE = "hide";
export const TOASTER_REVEAL = "reveal";

// Error page default texts
export const errorHeaderDefaultText = "This page is outside the universe";
export const errorDescDefaultText = (
  <>
    The page you are trying to access doesn’t exist or has been moved.
    <br /> Try going back to your Main page
  </>
);

// with error in toaster context
export const errorHeaderDefaultTextWhenError =
  "Your spaceship has encountered a bug";
export const errorDescDefaultTextWhenError = (
  <>A significant error has been encountered</>
);

export const defaultErrorText = "Something went wrong. Please try again";
