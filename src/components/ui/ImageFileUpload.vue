<template>
  <div class="file-upload">
    <label class="custom-file-upload">
      <input
        type="file"
        @change="handleFileUpload"
        accept=".pdf, image/*"
        ref="fileInput"
        :disabled="disabled"
      />
      {{ buttonText }}
    </label>
    <div v-if="file || initialFileUrl">
      <p v-if="file">File Name: {{ file.name }}</p>
      <p v-if="file">
        File Size: {{ (file.size / 1024 / 1024).toFixed(2) }} MB
      </p>
      <div v-if="isImage">
        <img :src="filePreview || initialFileUrl" alt="Image Preview" />
      </div>
      <div v-if="isPdf" class="pdf-preview">
        <p>This is a PDF file</p>
        <font-awesome-icon icon="file-pdf" class="pdf-icon" />
      </div>
      <button @click="removeFile" class="remove-button">
        <font-awesome-icon icon="trash" />
      </button>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    buttonText: {
      type: String,
      default: "Choose File",
    },
    initialFileUrl: {
      type: String,
      default: "",
    },
    disabled: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      file: null,
      filePreview: null,
      isImage: false,
      isPdf: false,
    };
  },
  watch: {
    initialFileUrl(newUrl) {
      if (newUrl) {
        this.isImage =
          newUrl.endsWith(".jpeg") ||
          newUrl.endsWith(".png") ||
          newUrl.endsWith(".gif");
        this.isPdf = newUrl.endsWith(".pdf");
      } else {
        this.resetFile();
      }
    },
  },
  methods: {
    handleFileUpload(event) {
      const selectedFile = event.target.files[0];
      const fileType = selectedFile.type;
      const validTypes = [
        "application/pdf",
        "image/jpeg",
        "image/png",
        "image/gif",
      ];

      if (validTypes.includes(fileType)) {
        this.file = selectedFile;
        this.isImage = fileType.startsWith("image");
        this.isPdf = fileType === "application/pdf";
        this.filePreview = URL.createObjectURL(selectedFile);
        this.$emit("file-upload", this.file);
      } else {
        alert("Please upload a valid PDF or image file.");
        this.resetFile();
        this.$emit("file-upload", null);
      }
    },
    removeFile() {
      this.resetFile();
      this.$emit("file-upload", null);
    },
    resetFile() {
      this.file = null;
      this.filePreview = null;
      this.isImage = false;
      this.isPdf = false;
      this.$refs.fileInput.value = ""; // Clear the file input
    },
  },
};
</script>

<style scoped>
.file-upload {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
}
.custom-file-upload {
  display: inline-block;
  padding: 6px 12px;
  cursor: pointer;
  background-color: #007bff;
  color: white;
  border-radius: 4px;
  margin-bottom: 10px;
  font-size: 14px;
  font-weight: bold;
  text-align: center;
}
.custom-file-upload input[type="file"] {
  display: none;
}
.file-upload button {
  padding: 5px 10px;
  margin-top: 5px;
}
.file-upload img {
  max-width: 100%;
  height: auto;
  margin-top: 10px;
  border: 1px solid #ccc;
  padding: 5px;
}
.pdf-preview {
  display: flex;
  align-items: center;
  margin-top: 10px;
}
.pdf-icon {
  font-size: 2em;
  color: red;
  margin-left: 10px;
}
.remove-button {
  background: none;
  border: none;
  cursor: pointer;
  color: red;
  font-size: 1.2em;
}
</style>
