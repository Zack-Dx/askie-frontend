import {
  memo,
  useMemo,
  useRef,
  useState,
  useEffect,
  useImperativeHandle,
  forwardRef,
} from "react";
import PropTypes from "prop-types";
import ReactQuill, { Quill } from "react-quill-new";
import axios from "axios";
import { CONFIG } from "@/constants";
import { toast } from "sonner";
const icons = Quill.import("ui/icons");

icons["code"] = `
  <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
    <path d="M8 12h8M10 15l-3-3 3-3M14 9l3 3-3 3"/>
    <rect x="3" y="4" width="18" height="16" rx="2"/>
  </svg>`;

icons["code-block"] = `
  <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
    <path d="M4 4h16v16H4z"/>
    <path d="M8 8h8v2H8zM8 12h5v2H8z"/>
  </svg>`;

const uploadImage = async (file) => {
  const formData = new FormData();
  formData.append("file", file);

  try {
    const response = await axios.post(
      `${CONFIG.BACKEND_API_URL}/questions/media/upload`,
      formData,
      {
        withCredentials: true,
        headers: { "Content-Type": "multipart/form-data" },
      }
    );
    return response.data.data.url;
  } catch (error) {
    console.error("Image upload failed:", error);
    return null;
  }
};

const handleImageDelete = async (deletedImageUrl) => {
  try {
    await axios.post(
      `${CONFIG.BACKEND_API_URL}/questions/media/delete`,
      { imageUrl: deletedImageUrl },
      { withCredentials: true }
    );
  } catch (error) {
    console.error("Failed to delete image:", error);
  }
};

// eslint-disable-next-line react/display-name
const RichEditor = forwardRef(({ content, handleContentChange }, ref) => {
  const [editorValue, setEditorValue] = useState(content);
  const quillRef = useRef(null);
  const previousImages = useRef(new Set());

  useImperativeHandle(ref, () => ({
    clearEditor: (content) => {
      if (quillRef.current) {
        const quill = quillRef.current.getEditor();
        quill.clipboard.dangerouslyPasteHTML(content);
      }
    },
  }));

  const extractImageUrls = (content) => {
    const div = document.createElement("div");
    div.innerHTML = content;
    const images = div.getElementsByTagName("img");
    return new Set(Array.from(images).map((img) => img.src));
  };

  useEffect(() => {
    if (!editorValue) {
      const imagesToDelete = Array.from(previousImages.current);
      imagesToDelete.forEach((imageUrl) => {
        handleImageDelete(imageUrl);
      });
      previousImages.current = new Set();
      return;
    }

    const currentImages = extractImageUrls(editorValue);

    const deletedImages = Array.from(previousImages.current).filter(
      (url) => !currentImages.has(url)
    );

    deletedImages.forEach((imageUrl) => {
      handleImageDelete(imageUrl);
    });

    previousImages.current = currentImages;
  }, [editorValue]);

  const handleChange = (value) => {
    setEditorValue(value);
    handleContentChange(value);
  };

  const handleImageUpload = async () => {
    const input = document.createElement("input");
    input.type = "file";
    input.accept = "image/*";
    input.style.display = "none";

    input.onchange = async (event) => {
      const file = event.target.files[0];
      if (file) {
        const toastId = toast.loading("Uploading image...");
        try {
          const imageUrl = await uploadImage(file);
          toast.success("Image uploaded successfully!", { id: toastId });
          if (imageUrl && quillRef.current) {
            const transformedUrl = imageUrl.replace(
              "/upload/",
              "/upload/w_1000,h_600,c_fill,q_auto,f_auto/"
            );

            const quill = quillRef.current.getEditor();
            const range = quill.getSelection() || {
              index: quill.getLength(),
              length: 0,
            };

            quill.insertEmbed(range.index, "image", transformedUrl);
            quill.setSelection(range.index + 1, 0);
            quill.insertText(range.index + 1, "\n");
            const scrollElement = quill.root.parentElement;
            setTimeout(() => {
              scrollElement.scrollTop = scrollElement.scrollHeight;
            }, 100);
          } else {
            toast.error("An error occurred while uploading", {
              id: toastId,
            });
          }
        } catch (error) {
          console.error("Failed to upload image", error);
          toast.error("An error occurred during upload.", { id: toastId });
        }
      }
    };

    document.body.appendChild(input);
    input.click();
    document.body.removeChild(input);
  };

  const modules = useMemo(() => {
    return {
      toolbar: {
        container: [
          [{ header: [1, 2, 3, false] }],
          ["bold", "italic", "underline"],
          [{ list: "ordered" }, { list: "bullet" }],
          [{ indent: "-1" }, { indent: "+1" }],
          ["link", "image"],
          // ["clean"],
          ["code", "code-block"],
        ],
        handlers: {
          image: handleImageUpload,
        },
      },
      clipboard: {
        matchVisual: false,
      },
    };
  }, []);

  return (
    <div
      style={{
        width: "60vw",
        height: "400px",
        border: "1px solid #ccc",
        borderRadius: "6px",
        margin: "0 auto",
      }}
    >
      <ReactQuill
        ref={quillRef}
        modules={modules}
        value={editorValue}
        onChange={handleChange}
        style={{ height: "100%" }}
      />
      <style>{`
        /* Tooltip Styling */
        .ql-toolbar button {
          position: relative;
        }

        .ql-toolbar button::after {
          content: attr(data-tooltip);
          position: absolute;
          top: -32px;
          left: 50%;
          transform: translateX(-50%);
          white-space: nowrap;
          background: #333;
          color: #fff;
          font-size: 12px;
          padding: 4px 8px;
          border-radius: 4px;
          opacity: 0;
          visibility: hidden;
          transition: opacity 0.2s, visibility 0.2s;
          z-index: 10;
        }

        .ql-toolbar button:hover::after {
          opacity: 1;
          visibility: visible;
        }

        /* Tooltip Text for Each Button */
        .ql-toolbar button.ql-header::after {
          content: "Heading";
        }

        .ql-toolbar button.ql-bold::after {
          content: "Bold";
        }

        .ql-toolbar button.ql-italic::after {
          content: "Italic";
        }

        .ql-toolbar button.ql-underline::after {
          content: "Underline";
        }

        .ql-toolbar button.ql-list[value="ordered"]::after {
          content: "Ordered List";
        }

        .ql-toolbar button.ql-list[value="bullet"]::after {
          content: "Bullet List";
        }

        .ql-toolbar button.ql-indent[value="-1"]::after {
          content: "Decrease Indent";
        }

        .ql-toolbar button.ql-indent[value="+1"]::after {
          content: "Increase Indent";
        }

        .ql-toolbar button.ql-link::after {
          content: "Insert Link";
        }

        .ql-toolbar button.ql-image::after {
          content: "Insert Image";
        }

        .ql-toolbar button.ql-code::after {
          content: "Inline Code";
        }

        .ql-toolbar button.ql-code-block::after {
          content: "Code Block";
        }

        .ql-container {
          height: calc(100% - 42px) !important;
          border: none !important;
        }

        .ql-editor {
          height: 100%;
          font-size: 16px;
          padding: 12px 15px;
          padding-bottom: 15px !important;
        }

        .ql-toolbar.ql-snow {
          border: none !important;
          border-bottom: 1px solid #ccc !important;
          padding: 8px;
        }

        .ql-editor img {
          max-width: 100%;
          height: auto;
          display: block;
          margin: 1em auto;
        }
      `}</style>
    </div>
  );
});

RichEditor.propTypes = {
  content: PropTypes.string,
  handleContentChange: PropTypes.func,
};

export default memo(RichEditor);
