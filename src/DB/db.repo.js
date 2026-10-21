export async function findOneDoc({ model, filter = {}, projection } = {}) {
  return model.findOne(filter, projection);
}

export async function createOneDoc({ model, insertedData, options } = {}) {
  const [doc] = await model.create([insertedData], options);
  return doc;
}
export async function findByIdDoc({ model, id, projection } = {}) {
  return model.findById(id, projection);
}
