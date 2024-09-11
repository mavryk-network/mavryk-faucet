import React, { CSSProperties, FC, HTMLAttributes, useMemo } from "react";

import Avatars from "@dicebear/avatars";
import botttsSprites from "@dicebear/avatars-bottts-sprites";
import * as jdenticonSpirtes from "jdenticon";

import initialsSprites from "../../../lib/avatars-initials-sprites";

export type IdeniconType = "jdenticon" | "bottts" | "initials";

type IdenticonProps = HTMLAttributes<HTMLDivElement> & {
  type?: IdeniconType;
  hash: string;
  size?: number;
  isToken?: boolean;
};

const MAX_INITIALS_LENGTH = 5;
const DEFAULT_FONT_SIZE = 50;

const cache = new Map<string, string>();

const UserIcon: FC<IdenticonProps> = ({
  type = "jdenticon",
  hash,
  size = 100,
  className,
  style = {},
  isToken = false,
  ...rest
}) => {
  const IS_WEB = true;

  const icons: Record<
    NonNullable<IdenticonProps["type"]>,
    Avatars<{}>
  > = useMemo(
    () =>
      IS_WEB
        ? {
            jdenticon: jdenticonSpirtes,
            bottts: new Avatars(botttsSprites),
            initials: new Avatars(initialsSprites),
          }
        : {},
    [IS_WEB],
  );

  const backgroundImage = useMemo(() => {
    const key = `${type}_${hash}_${size}`;
    if (cache.has(key)) {
      return cache.get(key);
    } else {
      const basicOpts = {
        base64: true,
        width: size,
        height: size,
        margin: 4,
        radius: 50,
      };

      const opts =
        type === "initials"
          ? {
              ...basicOpts,
              chars: MAX_INITIALS_LENGTH,
              radius: 50,

              fontSize: estimateOptimalFontSize(
                hash.slice(0, MAX_INITIALS_LENGTH).length,
              ),
            }
          : basicOpts;
      const additionalOpts = isToken ? { background: "transparent" } : {};

      const imgSrc = icons[type].create(hash, { ...opts, ...additionalOpts });

      const bi = `url('${imgSrc}')`;
      cache.set(key, bi);
      return bi;
    }
  }, [type, hash, size, isToken, icons]);

  const memoizedStyle = useMemo(
    () =>
      isToken && type === "initials"
        ? {
            top: 0,
            left: 0,
          }
        : style,
    [isToken, type, style],
  );

  return (
    <RenderIcon
      addWrapper={isToken && type === "initials"}
      style={{
        width: size,
        height: size,
        maxWidth: size,
        ...style,
      }}
    >
      <div
        style={{
          backgroundImage,
          width: size,
          height: size,
          maxWidth: size,
          zIndex: isToken ? 1 : 0,
          ...memoizedStyle,
        }}
        {...rest}
      />
      {isToken && type === "initials" && (
        <div className="absolute inset-0 rounded-full">
          <img
            style={{ objectFit: "contain" }}
            src="/assets/account.png"
            className=" w-full h-full"
            alt="no token"
          />
        </div>
      )}
    </RenderIcon>
  );
};

export default UserIcon;

export function estimateOptimalFontSize(
  length: number,
  defaultFontSize = DEFAULT_FONT_SIZE,
) {
  const initialsLength = Math.min(length, MAX_INITIALS_LENGTH);
  if (initialsLength > 2) {
    const n = initialsLength;
    const multiplier = Math.sqrt(
      10000 / ((32 * n + 4 * (n - 1)) ** 2 + 36 ** 2),
    );
    return Math.floor(defaultFontSize * multiplier);
  }
  return defaultFontSize;
}

const RenderIcon: FC<
  React.ReactNode & {
    addWrapper: boolean;
    style: CSSProperties;
  }
> = ({ addWrapper, children, style }) => {
  return addWrapper ? <div style={style}>{children}</div> : <>{children}</>;
};
