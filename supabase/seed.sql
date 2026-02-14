insert into organizations (id, name, currency)
values ('00000000-0000-0000-0000-000000000001','Demo Org','USD');

insert into products (organization_id, name, price, stock)
values 
('00000000-0000-0000-0000-000000000001','Sample Product A',20,50),
('00000000-0000-0000-0000-000000000001','Sample Product B',35,30);