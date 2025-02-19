"""empty message

Revision ID: 2ab7a274856c
Revises: b21a42f08a3b
Create Date: 2024-11-22 06:34:27.212972

"""
from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision = '2ab7a274856c'
down_revision = 'b21a42f08a3b'
branch_labels = None
depends_on = None


def upgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    with op.batch_alter_table('critico', schema=None) as batch_op:
        batch_op.alter_column('acerca_de_mi',
               existing_type=sa.VARCHAR(length=80),
               type_=sa.String(length=500),
               existing_nullable=False)

    # ### end Alembic commands ###


def downgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    with op.batch_alter_table('critico', schema=None) as batch_op:
        batch_op.alter_column('acerca_de_mi',
               existing_type=sa.String(length=500),
               type_=sa.VARCHAR(length=80),
               existing_nullable=False)

    # ### end Alembic commands ###
