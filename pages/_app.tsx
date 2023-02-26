import type { AppProps } from 'next/app'
import '../Styles/global.scss'
import '../public/NextFonts/PTSans/stylesheet.css'


export default function App({ Component, pageProps }: AppProps) {
  return <Component {...pageProps} />
}
