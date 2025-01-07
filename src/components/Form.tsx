import { FormEvent, useMemo, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "./ui/dialog";

export function Form() {
  const [urlInput, setUrlInput] = useState("");
  const [isOpenModal, setIsOpenModal] = useState(false);

  const url = useMemo(() => {
    if (urlInput !== "")
      return `http://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${urlInput}`;
    return "";
  }, [urlInput]);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    if (urlInput !== "") setIsOpenModal(true);
  }

  function clearForm() {
    const form = document.getElementById("qr-form") as HTMLFormElement;
    form?.reset();
    setUrlInput("");
  }

  function closeModal() {
    clearForm();
    setIsOpenModal(false);
  }

  function downloadImage() {
    fetch(url, {
      method: "GET",
      headers: {},
    }).then((res) => {
      res
        .arrayBuffer()
        .then((buffer) => {
          const url = window.URL.createObjectURL(new Blob([buffer]));
          const anchor = document.createElement("a");
          anchor.href = url;
          anchor.setAttribute(
            "download",
            `qreate-code-${new Date().toJSON()}.png`
          );
          document.body.appendChild(anchor);
          anchor.click();
        })
        .catch((e) => {
          throw e;
        });
    });
  }

  return (
    <section className="h-full flex items-center justify-center">
      <div className="flex flex-col w-full lg:w-[70%]">
        <h4 className="text-xl font-semibold">Create your QR code now!</h4>
        <form id="qr-form" onSubmit={handleSubmit}>
          <input
            onChange={(e) => setUrlInput(e.target.value)}
            type="url"
            name="url"
            className="border border-black w-full mt-4 p-2 rounded"
            placeholder="ex: https://www.mysite.com"
          />
          <button
            type="submit"
            className="bg-black text-white rounded mt-4 p-2 font-semibold w-full"
          >
            Create
          </button>
        </form>
      </div>

      <Dialog open={isOpenModal} onOpenChange={closeModal}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>That&apos;s all!</DialogTitle>
            <DialogDescription>
              Pretty simple right? Now just download your image and share your
              code with the world! 🌎
            </DialogDescription>
          </DialogHeader>
          <div className="flex flex-col items-center justify-center">
            <img className="my-4" src={url} alt="created-qrcode" />

            <button
              className="bg-black text-white rounded mt-4 p-2 font-semibold w-full"
              onClick={downloadImage}
            >
              Save
            </button>
          </div>
        </DialogContent>
      </Dialog>
    </section>
  );
}
