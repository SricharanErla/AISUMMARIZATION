import { Upload } from 'lucide-react';

export const FileDropzone = ({
  label,
  accept,
  onChange,
}: {
  label: string;
  accept: string;
  onChange: (file: File | null) => void;
}) => {
  return (
    <label className="block rounded-3xl border border-dashed border-white/15 bg-white/5 p-6 text-center cursor-pointer hover:border-cyan-400/60 transition">
      <Upload className="mx-auto h-8 w-8 text-cyan-300" />
      <p className="mt-3 text-sm text-white/80">{label}</p>
      <p className="mt-1 text-xs text-white/45">PDF, DOCX, or audio for voice workflows</p>
      <input
        type="file"
        accept={accept}
        className="hidden"
        onChange={(event) => onChange(event.target.files?.[0] ?? null)}
      />
    </label>
  );
};
