import React, { useState } from "react";
import { Link } from "react-router-dom";
import { useTracker } from "meteor/react-meteor-data";
import { SchemaCollection } from "../api/schema";
import { SchemaModal } from "./SchemaModal/SchemaModal.jsx";
import {
  Container,
  Button,
  Grid,
  makeStyles,
  Typography,
  Table,
  TableContainer,
  Paper,
  TableHead,
  TableBody,
  TableRow,
  TableCell,
  CircularProgress,
  Tooltip,
} from "@material-ui/core";

const useStyles = makeStyles((theme) => ({
  schemaContainer: {
    marginTop: 40,
  },
  tableHead: {
    bckgroundColor: theme.palette.grey[700],
  },
  tableNameCol: {
    width: "25%",
  },
  tableRow: {
    "&:hover": {
      backgroundColor: theme.palette.action.hover,
    },
  },
  spinner: {
    color: theme.palette.text.primary,
  },
  link: {
    color: theme.palette.text.primary,
  },
}));

const newSchemaValues = {
  name: "",
  description: "",
  fields: [
    {
      name: "reference",
      type: "string",
      allowedValues: [],
    },
  ],
};

export const SchemasTable = () => {
  const classes = useStyles();

  const [showModal, setShowModal] = useState(false);
  const [newSchema, setNewSchema] = useState(true);
  const [initialSchemaValues, setInitialSchemaValues] =
    useState(newSchemaValues);

  const [schemas, isLoading] = useTracker(() => {
    const sub = Meteor.subscribe("schemas");
    const schemas = SchemaCollection.find().fetch();
    return [schemas, !sub.ready()];
  });

  const handleAddNewSchema = () => {
    setNewSchema(true);
    setShowModal(true);
    setInitialSchemaValues(newSchemaValues);
  };

  const handleRowClick = (schemaObject) => {
    setNewSchema(false);
    setShowModal(true);
    setInitialSchemaValues(schemaObject);
  };

  return (
    <React.Fragment>
      <Container className={classes.schemaContainer} maxWidth="md">
        <Grid container justify="space-between" alignItems="center">
          <Grid item xs>
            <Typography variant="h3">Schemas</Typography>
          </Grid>
          <Grid container item xs justify="flex-end">
            <Button
              variant="contained"
              color="primary"
              onClick={handleAddNewSchema}
            >
              + Add New Schema
            </Button>
          </Grid>
        </Grid>
        <Typography gutterBottom variant="body2" style={{ marginTop: 10 }}>
          Each piece of data you want to store has its own{" "}
          <strong>schema</strong>. You can characterize a given satellite using
          any number of schemas. Please see the satellites on the{" "}
          <Tooltip title="Bring me to the schemas page">
            <Link exact to="/satellites" className={classes.link}>
              previous page
            </Link>
          </Tooltip>{" "}
          for usage examples.
        </Typography>
        <Typography gutterBottom variant="body2">
          Each <strong>schema</strong> has a reference (where the data was
          found), a description (describing what the data is), and a number of
          data fields (that contain the actual information).
        </Typography>
        <Typography gutterBottom variant="body2" style={{ marginBottom: 25 }}>
          Click on a desired <strong>schema</strong> below to view its details
          and edit the entry fields.
        </Typography>
        <TableContainer component={Paper}>
          <Table size="small" aria-label="Schema table">
            <TableHead>
              <TableRow color="secondary">
                <TableCell className={classes.tableNameCol}>
                  <strong>NAME</strong>
                </TableCell>
                <TableCell>
                  <strong>DESCRIPTION</strong>
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {isLoading && (
                <TableRow>
                  <TableCell colSpan={2} align="center">
                    <CircularProgress className={classes.spinner} />
                  </TableCell>
                </TableRow>
              )}
              {!isLoading &&
                schemas.map((schema, i) => (
                  <TableRow
                    key={`schema-row-${i}`}
                    className={classes.tableRow}
                    onClick={() => handleRowClick(schema)}
                  >
                    <TableCell
                      key={`schema-name-${i}`}
                      className={classes.tableNameCol}
                    >
                      {schema.name}
                    </TableCell>
                    <TableCell key={`schema-desc-${i}`}>
                      {schema.description}
                    </TableCell>
                  </TableRow>
                ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Container>
      <SchemaModal
        show={showModal}
        newSchema={newSchema}
        initValues={initialSchemaValues}
        handleClose={() => setShowModal(false)}
      />
    </React.Fragment>
  );
};