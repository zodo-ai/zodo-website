import React, { useRef, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { apiCall } from "@/network/api";
import toast from "react-hot-toast";
import axios from "axios";

interface FileDetailsI {
  url: string;
  filename: string;
  key: string;
}

interface DocumentDetails {
  document1: FileDetailsI;
  handleDocument1: Function;
  document2: FileDetailsI;
  handleDocument2: Function;
}
function DocumentsUpload({
  document1,
  handleDocument1,
  document2,
  handleDocument2,
}: DocumentDetails) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [file, setFile] = useState<File | null>(null);
  const [error, setError] = useState("");
  const apiURL = "file-upload";
  const onChangeDocumen1 = async (e: React.ChangeEvent<HTMLInputElement>) => {
    setError("");
    const selected = e.target.files?.[0];
    if (!selected) {
      setFile(null);
      return;
    }
    if (selected.type !== "application/pdf") {
      setError("Only PDF files are allowed.");
      setFile(null);
      return;
    }
    const formData = new FormData();
    formData.append("file", selected);

    try {
      const response = await axios.post(
        "https://api.zodoai.com/api/file-upload",
        formData
      );
      const message = response?.data?.message;
      console.log(message);

      if (message) {
        const url = response?.data?.data?.url;
        const fileName = response?.data?.data?.filename;
        const key = response?.data?.data?.key;
        const data = { url: url, filename: fileName, key: key };
        handleDocument1(data);
        toast.success(message);
      }
    } catch (error) {
      console.log(error);
      toast.error("Unable to upload file");
    }

    // setFile(selected);
  };

  const onChangeDocumen2 = async (e: React.ChangeEvent<HTMLInputElement>) => {
    setError("");
    const selected = e.target.files?.[0];
    if (!selected) {
      setFile(null);
      return;
    }
    if (selected.type !== "application/pdf") {
      setError("Only PDF files are allowed.");
      setFile(null);
      return;
    }
    const formData = new FormData();
    formData.append("file", selected);

    try {
      const response = await axios.post(
        "https://api.zodoai.com/api/file-upload",
        formData
      );
      const message = response?.data?.message;

      if (message) {
        const url = response?.data?.data?.url;
        const fileName = response?.data?.data?.filename;
        const key = response?.data?.data?.key;
        const data = { url: url, filename: fileName, key: key };
        handleDocument2(data);
        toast.success(message);
      }
    } catch (error) {
      console.log(error);
      toast.error("Unable to upload file");
    }

    // setFile(selected);
  };

  console.log("Docyment 1", document1);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Upload Documents</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="sm:flex">
          <div className="max-w-md mx-auto rounded-xl p-6 flex flex-col gap-5">
            {/* <label
              className="block font-medium text-gray-800 text-sm mb-1"
              htmlFor="file-upload"
            >
              Choose a PDF file
            </label> */}
            {/* A visually hidden input, but accessible */}
            <input
              ref={inputRef}
              id="file-upload"
              type="file"
              accept=".pdf"
              className="block w-full file:mr-4 file:py-2 file:px-4
          file:rounded-full file:border-0
          file:text-sm file:font-semibold
          file:bg-teal-50 file:text-teal-700
          hover:file:bg-teal-100"
              onChange={onChangeDocumen1}
            />
            {error && <div className="text-red-500 text-sm">{error}</div>}
            {document1?.url && (
              <div className="border rounded-lg p-3 flex flex-col sm:flex-row items-center gap-3 bg-gray-50">
                <span className="truncate font-medium text-teal-700">
                  {document1?.filename}
                </span>
                <a
                  href={document1?.url}
                  //   download={file.name}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="ml-0 sm:ml-auto inline-block bg-teal-600 text-white rounded px-4 py-2 text-xs font-medium shadow hover:bg-teal-700 transition"
                >
                  Download / Preview
                </a>
              </div>
            )}
            <p className="text-xs text-gray-400">
              Only .pdf files are allowed. Max size is{" "}
              {Math.round((1024 * 1024 * 2) / 1024 / 1024)}MB.
            </p>
          </div>

          <div className="max-w-md mx-auto rounded-xl bg-white p-6 flex flex-col gap-5 ">
            {/* <label
              className="block font-medium text-gray-800 text-sm mb-1"
              htmlFor="file-upload"
            >
              Choose a PDF file
            </label> */}
            {/* A visually hidden input, but accessible */}
            <input
              ref={inputRef}
              id="file-upload"
              type="file"
              accept=".pdf"
              className="block w-full file:mr-4 file:py-2 file:px-4
          file:rounded-full file:border-0
          file:text-sm file:font-semibold
          file:bg-teal-50 file:text-teal-700
          hover:file:bg-teal-100"
              onChange={onChangeDocumen2}
            />
            {error && <div className="text-red-500 text-sm">{error}</div>}
            {document2?.filename && (
              <div className="border rounded-lg p-3 flex flex-col sm:flex-row items-center gap-3 bg-gray-50">
                <span className="truncate font-medium text-teal-700">
                  {document2?.filename}
                </span>
                <a
                  href={document2.url}
                  //   download={file.name}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="ml-0 sm:ml-auto inline-block bg-teal-600 text-white rounded px-4 py-2 text-xs font-medium shadow hover:bg-teal-700 transition"
                >
                  Download / Preview
                </a>
              </div>
            )}
            <p className="text-xs text-gray-400">
              Only .pdf files are allowed. Max size is{" "}
              {Math.round((1024 * 1024 * 2) / 1024 / 1024)}MB.
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

export default DocumentsUpload;
