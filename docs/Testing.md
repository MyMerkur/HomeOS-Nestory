# Testing

| Katman | Araç | Minimum kapsam |
|---|---|---|
| Backend unit | Jest | Service fonksiyonları: auth, membership, inventory, shopping |
| Backend integration | Jest + Supertest | Auth flow, protected endpoint, inventory CRUD, shopping check |
| Mobile component | React Native Testing Library | ItemCard, AddItem form validation, ShoppingItem row |
| Mobile e2e | Maestro / Detox | Register/login, home create, add item, shopping add akışı |
| Manual QA | Checklist | Release öncesi cihaz testleri |

## Definition of Done (test açısından)

- En az bir happy path test veya manuel test sonucu var.
- Backend validation hem service hem endpoint seviyesinde test edilmiş.
- Loading/empty/error state mobilde manuel doğrulanmış.
