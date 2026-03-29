<template>
  <div class="issue-tracker">
    <!-- Issues List -->
    <div v-if="issues.length > 0" class="issues-list">
      <div v-for="issue in issues" :key="issue.id" class="issue-card">
        <!-- Issue Header -->
        <div class="issue-header">
          <h3>{{ issue.title }}</h3>
          <div class="header-badges">
            <span class="status-badge" :class="`status-${issue.status}`">
              {{ formatStatus(issue.status) }}
            </span>
            <span class="priority-badge" :class="`priority-${issue.priority}`">
              {{ issue.priority?.toUpperCase() }}
            </span>
          </div>
        </div>

        <!-- Issue Description -->
        <p class="issue-description">{{ issue.description }}</p>

        <!-- Issue Meta -->
        <div class="issue-meta">
          <div class="meta-item">
            <label>Assigned to:</label>
            <span>{{ issue.assignedTo || 'Unassigned' }}</span>
          </div>
          <div class="meta-item">
            <label>Due Date:</label>
            <span>{{ formatDate(issue.dueDate) }}</span>
          </div>
          <div class="meta-item">
            <label>Updated:</label>
            <span>{{ formatDate(issue.updatedDate) }}</span>
          </div>
        </div>

        <!-- Issue Actions -->
        <div class="issue-actions">
          <button class="action-btn" @click="toggleStatusMenu(issue.id)">
            Change Status
          </button>
          <button class="action-btn secondary" @click="toggleAssigneeMenu(issue.id)">
            Reassign
          </button>
          <button class="action-btn secondary" @click="toggleCommentSection(issue.id)">
            {{ expandedComments.includes(issue.id) ? 'Hide' : 'Show' }} Comments
            <span v-if="issue.comments?.length" class="comment-count">({{ issue.comments.length }})</span>
          </button>
        </div>

        <!-- Comments Section -->
        <transition name="expand">
          <div v-if="expandedComments.includes(issue.id)" class="comments-section">
            <div v-if="issue.comments?.length" class="comments-list">
              <div v-for="comment in issue.comments" :key="comment.id" class="comment">
                <div class="comment-header">
                  <span class="comment-author">{{ comment.author }}</span>
                  <span class="comment-time">{{ formatDate(comment.timestamp) }}</span>
                </div>
                <p class="comment-text">{{ comment.text }}</p>
              </div>
            </div>
            <div class="add-comment">
              <input
                v-model="commentText[issue.id]"
                type="text"
                placeholder="Add a comment..."
                class="comment-input"
                @keyup.enter="addComment(issue.id)"
              />
              <button class="comment-submit" @click="addComment(issue.id)">
                Comment
              </button>
            </div>
          </div>
        </transition>
      </div>
    </div>

    <!-- Empty State -->
    <div v-else class="empty-state">
      <p>No issues created yet for this vulnerability.</p>
      <button class="action-btn" @click="$emit('create-issue')">Create First Issue</button>
    </div>

    <!-- Add New Issue Form -->
    <div class="add-issue-form">
      <h3>Create New Issue</h3>
      <form @submit.prevent="submitNewIssue">
        <div class="form-group">
          <label for="title">Title *</label>
          <input v-model="newIssue.title" type="text" id="title" placeholder="Issue title" required />
        </div>
        <div class="form-group">
          <label for="description">Description</label>
          <textarea v-model="newIssue.description" id="description" placeholder="Describe the issue..." rows="4"></textarea>
        </div>
        <div class="form-row">
          <div class="form-group">
            <label for="priority">Priority *</label>
            <select v-model="newIssue.priority" id="priority" required>
              <option value="critical">Critical</option>
              <option value="high">High</option>
              <option value="medium">Medium</option>
              <option value="low">Low</option>
            </select>
          </div>
          <div class="form-group">
            <label for="assignee">Assign to</label>
            <select v-model="newIssue.assignedTo" id="assignee">
              <option value="">Unassigned</option>
              <option value="Alice Johnson">Alice Johnson</option>
              <option value="Bob Smith">Bob Smith</option>
              <option value="Charlie Brown">Charlie Brown</option>
            </select>
          </div>
        </div>
        <div class="form-group">
          <label for="dueDate">Due Date</label>
          <input v-model="newIssue.dueDate" type="date" id="dueDate" />
        </div>
        <div class="form-actions">
          <button type="submit" class="action-btn">Create Issue</button>
          <button type="button" class="action-btn secondary" @click="resetForm">Cancel</button>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup>
import { ref, defineProps, defineEmits } from 'vue'
import { useVulnerabilitiesStore } from '../stores/vulnerabilities'

const props = defineProps({
  vulnId: String,
  issues: Array
})

const emit = defineEmits(['update', 'create-issue'])

const vulnStore = useVulnerabilitiesStore()

const expandedComments = ref([])
const commentText = ref({})
const newIssue = ref({
  title: '',
  description: '',
  priority: 'high',
  assignedTo: '',
  dueDate: ''
})

const formatStatus = (status) => {
  return status.split('-').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ')
}

const formatDate = (date) => {
  if (!date) return 'N/A'
  const d = new Date(date)
  const now = new Date()
  const diffTime = Math.abs(now - d)
  const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24))

  if (diffDays === 0) return 'Today'
  if (diffDays === 1) return 'Yesterday'
  if (diffDays < 7) return `${diffDays} days ago`

  return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
}

const toggleCommentSection = (issueId) => {
  const idx = expandedComments.value.indexOf(issueId)
  if (idx > -1) {
    expandedComments.value.splice(idx, 1)
  } else {
    expandedComments.value.push(issueId)
  }
}

const addComment = (issueId) => {
  const text = commentText.value[issueId]?.trim()
  if (!text) return

  vulnStore.addCommentToIssue(props.vulnId, issueId, text)
  commentText.value[issueId] = ''
  emit('update')
}

const toggleStatusMenu = (issueId) => {
  // This would open a menu in a real implementation
  // For now, cycle through statuses
  const statuses = ['open', 'in-progress', 'fixed', 'closed']
  const issue = props.issues.find(i => i.id === issueId)
  if (issue) {
    const currentIndex = statuses.indexOf(issue.status)
    const nextStatus = statuses[(currentIndex + 1) % statuses.length]
    vulnStore.updateIssueStatus(props.vulnId, issueId, nextStatus)
    emit('update')
  }
}

const toggleAssigneeMenu = (issueId) => {
  // This would open a menu in a real implementation
  const assignees = ['Alice Johnson', 'Bob Smith', 'Charlie Brown']
  const issue = props.issues.find(i => i.id === issueId)
  if (issue) {
    const currentIndex = assignees.indexOf(issue.assignedTo || '')
    const nextAssignee = assignees[(currentIndex + 1) % assignees.length]
    vulnStore.updateIssueAssignment(props.vulnId, issueId, nextAssignee)
    emit('update')
  }
}

const submitNewIssue = () => {
  if (!newIssue.value.title.trim()) {
    alert('Please enter an issue title')
    return
  }

  // In a real app, this would call the store
  console.log('Creating new issue:', newIssue.value)
  resetForm()
  emit('create-issue')
}

const resetForm = () => {
  newIssue.value = {
    title: '',
    description: '',
    priority: 'high',
    assignedTo: '',
    dueDate: ''
  }
}
</script>

<style scoped>
.issue-tracker {
  display: flex;
  flex-direction: column;
  gap: 24px;
}

.issues-list {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.issue-card {
  background: var(--bg-tertiary);
  border: 1px solid var(--border-color);
  border-radius: 8px;
  padding: 20px;
  transition: border-color 0.2s, box-shadow 0.2s;
}

.issue-card:hover {
  border-color: var(--color-primary);
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
}

.issue-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  gap: 16px;
  margin-bottom: 12px;
}

.issue-header h3 {
  margin: 0;
  font-size: 16px;
  font-weight: 600;
  color: var(--text-primary);
  flex: 1;
}

.header-badges {
  display: flex;
  gap: 8px;
}

.status-badge,
.priority-badge {
  padding: 4px 10px;
  border-radius: 4px;
  font-size: 12px;
  font-weight: 600;
  white-space: nowrap;
}

.status-badge {
  &.status-open {
    background: #fee2e2;
    color: #991b1b;
  }
  &.status-in-progress {
    background: #fef3c7;
    color: #92400e;
  }
  &.status-fixed {
    background: #d1fae5;
    color: #065f46;
  }
  &.status-closed {
    background: #e5e7eb;
    color: #374151;
  }
}

.priority-badge {
  &.priority-critical {
    background: #fecaca;
    color: #991b1b;
  }
  &.priority-high {
    background: #fed7aa;
    color: #92400e;
  }
  &.priority-medium {
    background: #fef08a;
    color: #713f12;
  }
  &.priority-low {
    background: #dcfce7;
    color: #166534;
  }
}

.issue-description {
  color: var(--text-secondary);
  font-size: 14px;
  line-height: 1.5;
  margin: 0 0 12px 0;
}

.issue-meta {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
  gap: 12px;
  margin: 16px 0;
  padding: 12px 0;
  border-top: 1px solid var(--border-color);
  border-bottom: 1px solid var(--border-color);
}

.meta-item {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.meta-item label {
  font-size: 11px;
  font-weight: 600;
  text-transform: uppercase;
  color: var(--text-secondary);
  letter-spacing: 0.5px;
}

.meta-item span {
  font-size: 14px;
  color: var(--text-primary);
}

.issue-actions {
  display: flex;
  gap: 8px;
  margin-top: 12px;
  flex-wrap: wrap;
}

.action-btn {
  padding: 8px 12px;
  border-radius: 4px;
  border: none;
  font-size: 13px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s;
  background: var(--color-primary);
  color: white;
  white-space: nowrap;

  &:hover {
    opacity: 0.9;
  }

  &.secondary {
    background: var(--bg-secondary);
    border: 1px solid var(--border-color);
    color: var(--text-primary);

    &:hover {
      background: var(--bg-primary);
    }
  }
}

.comment-count {
  font-size: 11px;
  opacity: 0.7;
}

.comments-section {
  margin-top: 16px;
  padding-top: 16px;
  border-top: 1px solid var(--border-color);
}

.comments-list {
  display: flex;
  flex-direction: column;
  gap: 12px;
  margin-bottom: 16px;
}

.comment {
  background: var(--bg-secondary);
  padding: 12px;
  border-radius: 4px;
  border-left: 3px solid var(--color-primary);
}

.comment-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 8px;
  gap: 8px;
}

.comment-author {
  font-size: 13px;
  font-weight: 600;
  color: var(--text-primary);
}

.comment-time {
  font-size: 12px;
  color: var(--text-secondary);
}

.comment-text {
  margin: 0;
  font-size: 13px;
  color: var(--text-secondary);
  line-height: 1.4;
}

.add-comment {
  display: flex;
  gap: 8px;
}

.comment-input {
  flex: 1;
  padding: 10px 12px;
  border: 1px solid var(--border-color);
  border-radius: 4px;
  font-size: 13px;
  background: var(--bg-secondary);
  color: var(--text-primary);

  &:focus {
    outline: none;
    border-color: var(--color-primary);
  }
}

.comment-submit {
  padding: 10px 16px;
  background: var(--color-primary);
  color: white;
  border: none;
  border-radius: 4px;
  font-size: 13px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s;

  &:hover {
    opacity: 0.9;
  }
}

.empty-state {
  text-align: center;
  padding: 32px 24px;
  color: var(--text-secondary);
}

.empty-state p {
  margin: 0 0 16px 0;
  font-size: 14px;
}

.add-issue-form {
  background: var(--bg-tertiary);
  border: 1px solid var(--border-color);
  border-radius: 8px;
  padding: 20px;
}

.add-issue-form h3 {
  margin: 0 0 16px 0;
  font-size: 14px;
  font-weight: 600;
  text-transform: uppercase;
  color: var(--text-primary);
  letter-spacing: 0.5px;
}

.form-group {
  margin-bottom: 16px;
}

.form-group label {
  display: block;
  font-size: 13px;
  font-weight: 600;
  margin-bottom: 6px;
  color: var(--text-primary);
}

.form-group input,
.form-group textarea,
.form-group select {
  width: 100%;
  padding: 10px 12px;
  border: 1px solid var(--border-color);
  border-radius: 4px;
  font-size: 13px;
  background: var(--bg-secondary);
  color: var(--text-primary);
  font-family: inherit;

  &:focus {
    outline: none;
    border-color: var(--color-primary);
    background: var(--bg-primary);
  }
}

.form-row {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 16px;
}

.form-actions {
  display: flex;
  gap: 8px;
  margin-top: 16px;
}

.form-actions button {
  flex: 1;
  padding: 10px 16px;
  border-radius: 4px;
  border: none;
  font-size: 13px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;

  &:first-child {
    background: var(--color-primary);
    color: white;

    &:hover {
      opacity: 0.9;
    }
  }

  &.secondary {
    background: var(--bg-secondary);
    border: 1px solid var(--border-color);
    color: var(--text-primary);

    &:hover {
      background: var(--bg-primary);
    }
  }
}

.expand-enter-active {
  animation: expandIn 0.3s ease;
}

.expand-leave-active {
  animation: expandOut 0.3s ease;
}

@keyframes expandIn {
  from {
    opacity: 0;
    max-height: 0;
  }
  to {
    opacity: 1;
    max-height: 1000px;
  }
}

@keyframes expandOut {
  from {
    opacity: 1;
    max-height: 1000px;
  }
  to {
    opacity: 0;
    max-height: 0;
  }
}
</style>
