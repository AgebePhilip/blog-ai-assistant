<template>
  <div class="container mt-5">
    <h2 class="text-center text-dark">AI Powered Text Editor</h2>
    <p class="text-center text-muted">
      Draft blog posts and get instant AI-powered title, summary, and keyword suggestions.
    </p>

    <div class="mb-4">
      <input v-model="title"
             placeholder="Enter blog title"
             class="form-control border-0 p-3 fs-5" />
    </div>

    <div class="mb-4">
      <quill-editor v-model="content"
                    :options="editorOptions"
                    class="w-100 border-0 custom-editor" />
    </div>

    <div class="d-flex justify-content-center gap-3">
      <button class="btn btn-outline-primary px-4 py-2 rounded-pill shadow-sm" @click="generateTitle">
        Generate Title
      </button>
      <button class="btn btn-outline-secondary px-4 py-2 rounded-pill shadow-sm" @click="summarizeContent">
        Summarize
      </button>
      <button class="btn btn-outline-info px-4 py-2 rounded-pill shadow-sm" @click="suggestKeywords">
        Suggest Keywords
      </button>
      <button class="btn btn-outline-success px-4 py-2 rounded-pill shadow-sm" @click="saveDraft">
        Save Draft
      </button>
    </div>

    <!-- Loading / status message -->
    <div v-if="statusMessage" class="mt-4 alert alert-info shadow-sm rounded-3">
      <span class="fw-semibold">{{ statusMessage }}</span>
    </div>

    <!-- Final AI result -->
    <div v-if="aiResponse" class="mt-3 alert alert-light rounded-3 shadow-sm">
      <strong class="fw-bold">AI Suggestion:</strong>
      <p class="mb-0">{{ aiResponse }}</p>
    </div>
  </div>
</template>

<script>
import { QuillEditor } from 'vue3-quill';
import { getTitleSuggestion, summarizeText, suggestKeywords } from '@/services/openai';
import { saveDraftToMockAPI } from '@/services/mockApi';

export default {
  components: { QuillEditor },
  data() {
    return {
      title: '',
      content: '',
      aiResponse: '',
      statusMessage: '',
      editorOptions: {
        placeholder: 'Write your blog post here...',
      }
    };
  },
  methods: {
    setStatus(msg) {
      this.statusMessage = msg;
    },
    async generateTitle() {
      this.aiResponse = await getTitleSuggestion(this.content, this.setStatus);
      this.title = this.aiResponse;
    },
    async summarizeContent() {
      this.aiResponse = await summarizeText(this.content, this.setStatus);
    },
    async suggestKeywords() {
      this.aiResponse = await suggestKeywords(this.content, this.setStatus);
    },
    async saveDraft() {
      this.setStatus('Saving draft...');
      const saved = await saveDraftToMockAPI(this.title, this.content);
      this.setStatus(`Draft saved locally with ID: ${saved.id}`);
    }
  }
};
</script>

<style scoped>
.custom-editor {
  min-height: 200px;
}
</style>
