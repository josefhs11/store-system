import React from 'react';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
import Dialog from '@material-ui/core/Dialog';
import Button from '@material-ui/core/Button';

import { withFormik, Form } from 'formik';
import * as Yup from 'yup';

import styled from 'styled-components';

import Input from '../../../../components/common/CustomInput';

const Row = styled.div`
  display: flex;
  justify-content: space-between;
`;

const RowItem = styled.div`
  width: 48%;
  margin-left: 12px,
  margin-right: 18px,
`;

const Section = styled.div`
  width: 100%
  margin-top: 32px;
`;

const renderActionButtons = (resetForm: Function, onClose: Function, handleSubmit: Function, isSubmitting: boolean): Object => (
  <DialogActions>
    <Button
      onClick={() => {
        resetForm();
        onClose();
      }}
      color="primary"
    >
      Cancelar
    </Button>
    <Button
      disabled={isSubmitting}
      onClick={() => handleSubmit()}
      color="primary"
    >
      Confirmar
    </Button>
  </DialogActions>
);

const renderNewPasswordSection = (touched: Object, errors: Object, handleChange: Function, handleBlur: Function): Object => (
  <Section>
    <Row>
      <RowItem>
        <Input
          error={touched.newPassword && errors.newPassword}
          onChange={handleChange}
          onBlur={handleBlur}
          placeholder="Informe a senha"
          label="Nova Senha"
          type="password"
          id="newPassword"
        />
      </RowItem>
      <RowItem>
        <Input
          error={touched.newPasswordConfirm && errors.newPasswordConfirm}
          onChange={handleChange}
          onBlur={handleBlur}
          placeholder="Informe a senha novamente"
          label="Digite a nova senha novamente"
          type="password"
          id="newPasswordConfirm"
        />
      </RowItem>
    </Row>
  </Section>
);

type Props = {
  handleChange: Function,
  handleSubmit: Function,
  handleReset: Function,
  handleBlur: Function,
  isSubmitting: boolean,
  touched: boolean,
  isOpen: boolean,
  onClose: Function,
  errors: Object,
};

const ChangePassword = ({
  isSubmitting,
  handleChange,
  handleSubmit,
  handleReset,
  handleBlur,
  onClose,
  touched,
  errors,
  isOpen,
}: Props): Object => (
  <Dialog
    aria-labelledby="form-dialog-title"
    onClose={() => onClose}
    keepMounted={false}
    open={isOpen}
  >
    <DialogTitle id="form-dialog-title">
      Trocar Senhar
    </DialogTitle>
    <DialogContent>
      <DialogContentText>
        Para trocar a senha, você precisa informar sua senha atual para então criar uma nova senha.
      </DialogContentText>
      <Form>
        <Section>
          <RowItem>
            <Input
              error={touched.currentPassword && errors.currentPassword}
              onChange={handleChange}
              onBlur={handleBlur}
              placeholder="Informe a senha atual"
              label="Senha atual"
              type="password"
              id="currentPassword"
            />
          </RowItem>
        </Section>
      </Form>
      {renderNewPasswordSection(touched, errors, handleChange, handleBlur)}
    </DialogContent>
    {renderActionButtons(handleReset, onClose, handleSubmit, isSubmitting)}
  </Dialog>
);

const ChangePasswordForm = withFormik({
  mapPropsToValues: ({ realPassword }) => ({
    newPasswordConfirm: '',
    currentPassword: '',
    newPassword: '',
    realPassword,
  }),

  validationSchema: Yup.object().shape({
    currentPassword: Yup.string()
      .oneOf([Yup.ref('realPassword'), null], 'Senha incoreta')
      .required('A senha atual é obrigatória.'),

    newPassword: Yup.string()
      .min(6, 'A senha deve conter no mínimo 6 caracteres.')
      .required('A senha é obrigatória.'),

    newPasswordConfirm: Yup.string()
      .oneOf([Yup.ref('newPassword'), null], 'Senhas diferentes')
      .required('As senhas precisam ser iguais.'),
  }),

  handleSubmit(values, { setSubmitting, props }) {
    const { onChangePassword } = props;
    const { newPassword } = values;

    onChangePassword(newPassword);
    setSubmitting(false);
  },
})(ChangePassword);

export default ChangePasswordForm;
