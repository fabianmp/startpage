export function getBlockStyle(color: string) {
  return {
    root: "shadow-lg",
    header: `flex flex-row bg-${color} font-bold text-white px-2 py-1 items-center justify-between`,
    body: "flex flex-row flex-nowrap gap-3 sm:p-4 p-4 overflow-x-auto",
  }
}

export function getGroupCardStyle(color: string) {
  return {
    root: `border-2 border-${color} rounded-lg gap-1 pb-1 w-3xs shadow-md flex-none`,
    header: `flex bg-${color} font-bold text-white sm:px-2 px-2 py-1 items-center justify-between`,
    body: "flex flex-col sm:p-2 p-2 gap-1 overflow-x-clip",
  }
}

export function getGroupStyle(
  color: string,
  colorMode: "light" | "dark" | "auto",
) {
  const hoverLinkStyle =
    colorMode === "dark"
      ? "text-white hover:text-white hover:bg-gray-800"
      : "text-black hover:text-black hover:bg-gray-100"
  return {
    root: `border-2 border-${color} rounded-lg gap-1 pb-1 min-w-3xs shadow-md`,
    title: `bg-${color} text-white px-2 py-1 items-center justify-between`,
    link: `${hoverLinkStyle} px-2 py-1`,
    list: "gap-1",
    linkLabelExternalIcon: "hidden",
  }
}
