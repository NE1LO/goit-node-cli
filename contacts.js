import * as fs from "node:fs/promises";
import path from "node:path";
import crypto from "node:crypto";
import { log } from "node:console";

const contactsPath = path.join("db", "contacts.json");
const writeContacts = (contacts) => {
  return fs.writeFile(contactsPath, JSON.stringify(contacts, null, 2));
};

async function listContacts() {
  try {
    const data = await fs.readFile(contactsPath, { encoding: "utf-8" });
    return JSON.parse(data);
  } catch (error) {
    console.error("Помилка при читанні файлу", error);
  }
}

async function getContactById(contactId) {
  try {
    const contacts = await listContacts();
    const contact = contacts.find((contact) => contact.id === contactId);
    if (typeof contact === "undefined") {
      return null;
    }
    return contact;
  } catch (error) {
    console.error("Помилка при читанні контакту по id", error);
  }
}

async function removeContact(contactId) {
  try {
    const contacts = await listContacts();
    const index = contacts.findIndex((contact) => contact.id === contactId);
    if (index !== -1) {
      const removedContact = contacts.splice(index, 1)[0];
      await writeContacts(contacts);
      return removedContact;
    }
    return null;
  } catch (error) {
    console.error("Помилка при видаленні контакту", error);
  }
}

async function addContact(name, email, phone) {
  try {
    const contacts = await listContacts();
    const newContact = { id: crypto.randomUUID(), name, email, phone };
    contacts.push(newContact);
    await writeContacts(contacts);
    console.log(newContact);
  } catch (error) {
    console.error("Помилка при додаванні контакту", error);
  }
}

export { listContacts, getContactById, removeContact, addContact };
