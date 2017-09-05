\c leasetopia;

DROP TABLE IF EXISTS users, landlords, properties, tenants, messages, transactions, events, documents CASCADE;

CREATE TABLE users ( 
	user_id              SERIAL NOT NULL,
	user_name						 text ,
	email                text  NOT NULL,
	user_password        text  NOT NULL,
	creditcard           text  ,
	created_date         date DEFAULT current_date ,
	is_landlord          bool  NOT NULL,
	twofactor_auth			 text,
	use_twofactor        bool DEFAULT false ,
	CONSTRAINT pk_users PRIMARY KEY ( user_id )
	-- CONSTRAINT uniq_email unique ( email )
 );

CREATE TABLE landlords ( 
	landlord_id          SERIAL NOT NULL,
	payment_set_up       bool DEFAULT false ,
	created_date         date DEFAULT current_date ,
	user_id              integer  NOT NULL,
	merchant_id					 text  ,
	CONSTRAINT pk_landlords PRIMARY KEY ( landlord_id )
 );

CREATE INDEX idx_landlords ON landlords ( user_id );

ALTER TABLE landlords ADD CONSTRAINT fk_landlords_users FOREIGN KEY ( user_id ) REFERENCES users( user_id ) ON DELETE CASCADE;

CREATE TABLE properties ( 
	property_id          SERIAL NOT NULL,
	property_name        text  NOT NULL,
	address              text  ,
	city                 text  ,
	state_abbrv          text  ,
	landlord_id          integer  ,
	created_date         date DEFAULT current_date ,
	CONSTRAINT pk_properties PRIMARY KEY ( property_id )
 );

CREATE INDEX idx_properties ON properties ( landlord_id );

ALTER TABLE properties ADD CONSTRAINT fk_properties_landlords FOREIGN KEY ( landlord_id ) REFERENCES landlords( landlord_id ) ON DELETE CASCADE;

CREATE TABLE tenants ( 
	tenant_id            SERIAL NOT NULL ,
	tenant_email				 text NOT NULL ,
	rent                 integer DEFAULT 0 NOT NULL,
	property_id          integer  ,
	is_active            bool DEFAULT true NOT NULL,
	due_date             date  ,
	created_date         date DEFAULT current_date ,
	user_id              integer  ,
	CONSTRAINT pk_tenants PRIMARY KEY ( tenant_id )
 );

CREATE INDEX idx_tenants ON tenants ( property_id );

CREATE INDEX idx_tenants_0 ON tenants ( user_id );

ALTER TABLE tenants ADD CONSTRAINT fk_tenants_properties FOREIGN KEY ( property_id ) REFERENCES properties( property_id ) ON DELETE CASCADE;

ALTER TABLE tenants ADD CONSTRAINT fk_tenants_users FOREIGN KEY ( user_id ) REFERENCES users( user_id ) ON DELETE CASCADE;

CREATE TABLE messages ( 
	message_id           SERIAL NOT NULL,
	message_content      text  ,
	message_type         text  NOT NULL,
	property_id          integer  ,
	is_read              bool DEFAULT false ,
	importance           text  ,
	sender_id            integer  ,
	sender_name					 text     ,
	recipient_id         integer  ,
	recipient_name       text     ,
	created_date         date DEFAULT current_date ,
	CONSTRAINT pk_messages PRIMARY KEY ( message_id )
 );

CREATE INDEX idx_messages_1 ON messages ( property_id );

CREATE INDEX idx_messages ON messages ( sender_id );

CREATE INDEX idx_messages_0 ON messages ( recipient_id );

COMMENT ON COLUMN messages.message_type IS 'direct, broadcast';

COMMENT ON COLUMN messages.property_id IS 'property for tenants to see alerts/broadcasts';

ALTER TABLE messages ADD CONSTRAINT fk_messages_properties FOREIGN KEY ( property_id ) REFERENCES properties( property_id ) ON DELETE CASCADE;

ALTER TABLE messages ADD CONSTRAINT fk_messages_users_sender FOREIGN KEY ( sender_id ) REFERENCES users( user_id ) ON DELETE CASCADE;

ALTER TABLE messages ADD CONSTRAINT fk_messages_users_recipient FOREIGN KEY ( recipient_id ) REFERENCES users( user_id ) ON DELETE CASCADE;

CREATE TABLE transactions ( 
	transaction_id       SERIAL NOT NULL,
	payment_identifier   text  ,
	transaction_amount   numeric  ,
	sender_id            integer  ,
	recipient_id         integer  ,
	created_date         date DEFAULT current_date ,
	CONSTRAINT pk_transactions PRIMARY KEY ( transaction_id )
 );

CREATE INDEX idx_transactions ON transactions ( sender_id );

CREATE INDEX idx_transactions_0 ON transactions ( recipient_id );

COMMENT ON COLUMN transactions.transaction_amount IS 'amount of transaction from sender to recipient';

ALTER TABLE transactions ADD CONSTRAINT fk_transactions_users_sender FOREIGN KEY ( sender_id ) REFERENCES users( user_id ) ON DELETE CASCADE;

ALTER TABLE transactions ADD CONSTRAINT fk_transactions_users_recipient FOREIGN KEY ( recipient_id ) REFERENCES users( user_id ) ON DELETE CASCADE;

CREATE TABLE events ( 
	event_id             SERIAL  NOT NULL,
	event_text           text  ,
	property_id          integer  ,
	created_date         date DEFAULT current_date ,
	CONSTRAINT pk_events PRIMARY KEY ( event_id )
 );

CREATE INDEX idx_events ON events ( property_id );

ALTER TABLE events ADD CONSTRAINT fk_events_properties FOREIGN KEY ( property_id ) REFERENCES properties( property_id ) ON DELETE CASCADE;

CREATE TABLE documents ( 
	document_id          SERIAL NOT NULL,
	landlord_id          integer  ,
	doc_type             text  ,
	doc_url              text  ,
	tenant_id            integer  ,
	property_id          integer  ,
	doc_body             text  ,
	created_date         date DEFAULT current_date ,
	CONSTRAINT pk_documents PRIMARY KEY ( document_id )
 );

CREATE INDEX idx_documents ON documents ( landlord_id );

CREATE INDEX idx_documents_0 ON documents ( tenant_id );

COMMENT ON COLUMN documents.doc_type IS 'lease, image, other';

COMMENT ON COLUMN documents.tenant_id IS 'For documents between a landlord and tenant (such as a lease)';

COMMENT ON COLUMN documents.property_id IS 'document belongs to which property?';

COMMENT ON COLUMN documents.doc_body IS 'For text-only docs with no file upload';

ALTER TABLE documents ADD CONSTRAINT fk_documents_landlords FOREIGN KEY ( landlord_id ) REFERENCES landlords( landlord_id ) ON DELETE CASCADE;

ALTER TABLE documents ADD CONSTRAINT fk_documents_tenants FOREIGN KEY ( tenant_id ) REFERENCES tenants( tenant_id ) ON DELETE CASCADE;

ALTER TABLE documents ADD CONSTRAINT fk_documents_properties FOREIGN KEY ( property_id ) REFERENCES properties( property_id ) ON DELETE CASCADE;

