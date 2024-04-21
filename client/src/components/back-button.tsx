import Link from "next/link";

interface BackButtonProps {
  href: string;
  label: string;
}

const BackButton = ({ href, label }: BackButtonProps) => {
  return (
    <Link
      href={href}
      className="text-black hover:text-accent hover:underline transition-all duration-200"
    >
      {label}
    </Link>
  );
};

export default BackButton;
