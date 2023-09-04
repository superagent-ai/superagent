import NextImage from "next/image";

export default function Logo() {
  return(
    <NextImage className="rounded-sm" src="/logo.png" alt="Superagent Cloud" width={38} height={38} />
  )

}