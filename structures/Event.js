module.exports = class Event {
  constructor(options = {}) { 
    if(!options.name) throw new Error(`${__filename} has no name property.`);
    Object.assign(this, options); 
  };
};