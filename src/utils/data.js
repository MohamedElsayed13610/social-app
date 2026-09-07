export function extractData(payload) {
  return payload?.data ?? payload;
}

export function extractList(payload, keys = []) {
  const data = extractData(payload);
  if (Array.isArray(data)) return data;
  for (const key of keys) {
    if (Array.isArray(data?.[key])) return data[key];
  }
  if (Array.isArray(data?.data)) return data.data;
  return [];
}

export function getId(value) {
  return value?._id || value?.id || value;
}

export function getUser(post) {
  return post?.user || post?.createdBy || post?.author || {};
}

export function getAvatar(user) {
  return user?.photo || user?.profilePhoto || user?.image || '';
}

export function getUserName(user) {
  return user?.name || user?.username || user?.email?.split('@')[0] || 'VibeLink user';
}

export function getPostBody(post) {
  return post?.body || post?.content || post?.text || '';
}

export function getPostImage(post) {
  return post?.image || post?.postImage || post?.photo || '';
}

export function getCommentText(comment) {
  return comment?.content || comment?.text || comment?.body || '';
}

export function getDate(value) {
  const raw = value?.createdAt || value?.created_at || value?.date;
  if (!raw) return '';
  const date = new Date(raw);
  return Number.isNaN(date.getTime()) ? '' : date.toLocaleString([], { dateStyle: 'medium', timeStyle: 'short' });
}
