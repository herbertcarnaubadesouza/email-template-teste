import dynamic from "next/dynamic";
import { useRef, useState } from "react";
import { EditorRef, EmailEditorProps } from "react-email-editor";
import styles from "../styles/Home.module.scss";
import sample from "./sample/girl.json";

const EmailEditor = dynamic(
  () => import("react-email-editor").then((mod) => mod.EmailEditor),
  { ssr: false }
);

export default function Home() {
  const emailEditorRef = useRef<EditorRef | null>(null);
  const [preview, setPreview] = useState(false);

  const saveDesign = () => {
    const unlayer = emailEditorRef.current?.editor;

    unlayer?.saveDesign((design: any) => {
      console.log("saveDesign", design);
      alert("Design JSON has been logged in your developer console.");
    });
  };

  const exportHtml = () => {
    const unlayer = emailEditorRef.current?.editor;

    if (unlayer) {
      unlayer.exportHtml((data: any) => {
        const { design, html } = data;
        console.log("exportHtml", html);
        alert("Output HTML has been logged in your developer console.");
      });
    } else {
      console.error("Unlayer editor is not defined");
    }
  };

  const togglePreview = () => {
    const unlayer = emailEditorRef.current?.editor;

    if (preview) {
      unlayer?.hidePreview();
      setPreview(false);
    } else {
      unlayer?.showPreview("desktop");
      setPreview(true);
    }
  };

  const onDesignLoad = (data: any) => {
    console.log("onDesignLoad", data);
  };

  const onLoad: EmailEditorProps["onLoad"] = (unlayer: any) => {
    console.log("onLoad", unlayer);
    unlayer.addEventListener("design:loaded", onDesignLoad);
    unlayer.loadDesign(sample);
  };

  const onReady: EmailEditorProps["onReady"] = (unlayer) => {
    emailEditorRef.current = { editor: unlayer };
  };

  return (
    <div className={styles.container}>
      <div className={styles.bar}>
        <h1>React Email Editor (Demo)</h1>

        <button onClick={togglePreview}>
          {preview ? "Hide" : "Show"} Preview
        </button>
        <button onClick={saveDesign}>Save Design</button>
        <button onClick={exportHtml}>Export HTML</button>
      </div>

      {/*@ts-ignore*/}
      <EmailEditor ref={emailEditorRef} onLoad={onLoad} onReady={onReady} />
    </div>
  );
}
