import React from "react";
import UploadDropzone from "../media/UploadDropzone.jsx";

export default function StepMedia({ data, onChange }) {
  const update = (field, value) => onChange({ ...data, [field]: value });
  return (
    <div className="space-y-6">
      <section className="card space-y-4 p-5">
        <header>
          <h3 className="font-serif text-lg text-brand-maroon">
            Ảnh bìa & Media
          </h3>
          <p className="text-xs text-hub-muted">
            Kéo thả hoặc chọn ảnh đại diện món ăn. Ưu tiên ánh sáng tự nhiên.
          </p>
        </header>
        <UploadDropzone
          images={data.images}
          onChange={(imgs) => update("images", imgs)}
        />
      </section>
    </div>
  );
}
