import Document, { Html, Head, Main, NextScript } from "next/document";

export default class MyDocument extends Document {
  render() {
    return (
      <Html>
        <Head>
          <meta name="Satzify" content="" />
          <link rel="preconnect" href="https://fonts.googleapis.com" />
          <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin />
          <link
            href="https://fonts.googleapis.com/css2?family=Poppins:wght@200;400;600;700&display=swap"
            rel="stylesheet"
          />
        </Head>
        <body className="bg-body text-white font-poppins">
          <Main />
          <NextScript />
        </body>
      </Html>
    );
  }
}
