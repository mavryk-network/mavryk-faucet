export default function Icon({
  icon = "help",
  className = "",
}: {
  icon: any;
  className: any;
}) {
  let extension = ".svg";

  return (
    <img className={className} src={`/icons/${icon}${extension}`} alt={icon} />
  );
}
